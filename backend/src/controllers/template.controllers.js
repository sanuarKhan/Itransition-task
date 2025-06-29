const db = require("../db/db");

const createTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      topic,
      thumbnail,
      isPublic,
      tags,
      allowedUserIds,
    } = req.body;
    if (!title || !description || !topic) {
      return res.status(400).json({
        success: false,
        message: "Title, description and topic are required fields",
      });
    }
    const ownerId = req.user.id;
    const newTemplate = await db.template.create({
      data: {
        title,
        description,
        topic,
        thumbnail,
        isPublic: isPublic !== false,
        ownerId,
        tags: {
          create:
            tags?.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })) || [],
        },
        allowedUsers: {
          create: allowedUserIds?.map((userId) => ({ userId })) || [],
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        allowedUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Template with this title already exists",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPublicTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, topic, tag, userId } = req.query;
    const offset = (page - 1) * limit;

    let where = { isPublic: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          tags: {
            some: {
              tag: {
                name: { contains: search, mode: "insensitive" },
              },
            },
          },
        },
      ];
    }

    if (topic) {
      where.topic = topic;
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { name: tag },
        },
      };
    }

    if (userId) {
      where.ownerId = userId;
    }

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
        ...(req.user && {
          likes: {
            where: { userId: req.user.id },
            select: { id: true },
          },
        }),
      },
      orderBy: { updatedAt: "desc" },
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
    });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getMyTemplates = async (req, res) => {
  try {
    const templates = await db.template.findMany({
      where: { ownerId: req.user.id },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true },
        },
        tags: {
          include: { tag: true },
        },
        questions: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ templates });
  } catch (error) {
    console.error("Get my templates error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTemplate,
  getPublicTemplates,
  getMyTemplates,
};
