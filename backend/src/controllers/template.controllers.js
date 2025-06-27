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

module.exports = {
  createTemplate,
};
