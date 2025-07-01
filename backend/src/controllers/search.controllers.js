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

    const searchTerms = q
      .trim()
      .split(" ")
      .map((term) => term.trim())
      .filter(Boolean); //TODO: need to study

    const where = {
      isPublic: true,
      OR: [
        // Search in title
        {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
        // Search in description
        {
          description: {
            contains: q,
            mode: "insensitive",
          },
        },
        // Search in questions
        {
          questions: {
            some: {
              //TODO: need to study
              OR: [
                {
                  title: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        },
        // Search in tags
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        // Search in comments
        {
          comments: {
            some: {
              content: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
        },
      ],
      ...(topic && { topic }),
      ...(tags && {
        tags: {
          some: {
            tag: {
              name: { in: tags.split(",") },
            },
          },
        },
      }),
    };

    const templates = await db.template.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, avatar: true },
        },
        tags: {
          include: { tag: true },
        },
        _count: {
          select: { forms: true, likes: true, comments: true },
        },
      },
      orderBy: [
        // Prioritize title matches
        {
          _relevance: {
            fields: ["title"],
            search: q,
            sort: "desc",
          },
        },
        { createdAt: "desc" },
      ],
      skip: offset,
      take: parseInt(limit),
    });

    const total = await db.template.count({ where });

    res.json({
      templates,
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
