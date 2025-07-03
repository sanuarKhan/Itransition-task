const db = require("../db/db");

const searchTemplatesCTRL = async (req, res) => {
  try {
    const { q, topic, tags, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.json({
        templates: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      });
    }

    let query = `
      SELECT
        t.*,
        u.name as ownerName,
        u.img as ownerImg,
        u.id as ownerId,
        (SELECT COUNT(*) FROM "forms" WHERE "templateId" = t.id) as formsCount,
        (SELECT COUNT(*) FROM "likes" WHERE "templateId" = t.id) as likesCount,
        (SELECT COUNT(*) FROM "comments" WHERE "templateId" = t.id) as commentsCount
      FROM "templates" t
      JOIN "users" u ON t."ownerId" = u.id
      WHERE t."isPublic" = true
    `;

    const queryParams = [];
    let paramIndex = 1;

    const searchTsQuery = q.split(' ').map(term => `${term}:*`).join(' & ');
    query += ` AND (t.search_vector @@ to_tsquery(${paramIndex++}) OR EXISTS (SELECT 1 FROM "questions" q WHERE q."templateId" = t.id AND q.search_vector @@ to_tsquery(${paramIndex++})))`;
    queryParams.push(searchTsQuery, searchTsQuery);

    if (topic) {
      query += ` AND t.topic = ${paramIndex++}`;
      queryParams.push(topic);
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query += ` AND EXISTS (SELECT 1 FROM "template_tags" tt JOIN "tags" tg ON tt."tagId" = tg.id WHERE tt."templateId" = t.id AND tg.name IN (${tagArray.map((_, i) => `${paramIndex + i}`).join(',')}))`;
      queryParams.push(...tagArray);
      paramIndex += tagArray.length;
    }

    query += ` ORDER BY ts_rank(t.search_vector, to_tsquery(${paramIndex++})) DESC, t."updatedAt" DESC LIMIT ${paramIndex++} OFFSET ${paramIndex++}`;
    queryParams.push(searchTsQuery, parseInt(limit), offset);

    const templates = await db.$queryRawUnsafe(query, ...queryParams);

    const totalQuery = `
      SELECT COUNT(*)
      FROM "templates" t
      JOIN "users" u ON t."ownerId" = u.id
      WHERE t."isPublic" = true
    `;
    const totalParams = [];
    paramIndex = 1;

    const totalSearchTsQuery = q.split(' ').map(term => `${term}:*`).join(' & ');
    totalQuery += ` AND (t.search_vector @@ to_tsquery(${paramIndex++}) OR EXISTS (SELECT 1 FROM "questions" q WHERE q."templateId" = t.id AND q.search_vector @@ to_tsquery(${paramIndex++})))`;
    totalParams.push(totalSearchTsQuery, totalSearchTsQuery);

    if (topic) {
      totalQuery += ` AND t.topic = ${paramIndex++}`;
      totalParams.push(topic);
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      totalQuery += ` AND EXISTS (SELECT 1 FROM "template_tags" tt JOIN "tags" tg ON tt."tagId" = tg.id WHERE tt."templateId" = t.id AND tg.name IN (${tagArray.map((_, i) => `${paramIndex + i}`).join(',')}))`;
      totalParams.push(...tagArray);
      paramIndex += tagArray.length;
    }

    const totalResult = await db.$queryRawUnsafe(totalQuery, ...totalParams);
    const total = totalResult[0].count;

    const formattedTemplates = templates.map(template => ({
      ...template,
      owner: {
        id: template.ownerId,
        name: template.ownerName,
        img: template.ownerImg,
      },
      _count: {
        forms: Number(template.formsCount),
        likes: Number(template.likesCount),
        comments: Number(template.commentsCount),
      },
    }));

    res.json({
      templates: formattedTemplates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      query: q,
    });
  } catch (error) {
    console.error("Search templates error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTagsCTRL = async (req, res) => {
  try {
    const { q } = req.query;

    const where = q
      ? {
          name: {
            contains: q,
            mode: "insensitive",
          },
        }
      : {};

    const tags = await db.tag.findMany({
      where,
      select: {
        id: true,
        name: true,
        _count: {
          select: { templates: true },
        },
      },
      orderBy: {
        templates: {
          _count: "desc",
        },
      },
      take: 20,
    });

    res.json({ tags });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTagCloudCTRL = async (req, res) => {
  try {
    const tags = await db.tag.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { templates: true },
        },
      },
      where: {
        templates: {
          some: {},
        },
      },
      orderBy: {
        templates: {
          _count: "desc",
        },
      },
      take: 30,
    });

    // Calculate tag weights for cloud visualization
    const maxCount = Math.max(...tags.map((tag) => tag._count.templates));
    const minCount = Math.min(...tags.map((tag) => tag._count.templates));

    const tagCloud = tags.map((tag) => ({
      ...tag,
      weight:
        maxCount > minCount
          ? Math.round(
              ((tag._count.templates - minCount) / (maxCount - minCount)) * 4
            ) + 1
          : 3, // default weight when all tags have same count
    }));

    res.json({ tags: tagCloud });
  } catch (error) {
    console.error("Get tag cloud error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSuggestionsCTRL = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Get template titles
    const templates = await db.template.findMany({
      where: {
        isPublic: true,
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: { title: true },
      take: 5,
    });

    // Get tag names
    const tags = await db.tag.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },
      },
      select: { name: true },
      take: 5,
    });

    const suggestions = [
      ...templates.map((t) => ({ type: "template", value: t.title })),
      ...tags.map((t) => ({ type: "tag", value: t.name })),
    ];

    res.json({ suggestions });
  } catch (error) {
    console.error("Get suggestions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  searchTemplatesCTRL,
  getTagsCTRL,
  getTagCloudCTRL,
  getSuggestionsCTRL,
};
