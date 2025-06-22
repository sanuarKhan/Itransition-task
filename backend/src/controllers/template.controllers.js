const db = require("../db/db");

const createTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      topic,
      thumbnail,
      isPublic,
      questions = [],
      tags = [],
    } = req.body;
    const ownerId = req.user.id;

    const validTopics = [
      "EDUCATION",
      "BUDGETS",
      "QUIZZ",
      "REPORTS",
      "RESEARCH",
      "SURVEY",
      "PULL",
      "OTHERS",
    ];

    if (!validTopics.includes(topic)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic. must be one of: " + validTopics.join(", "),
      });
    }

    const newTemplate = await db.template.create({
      data: {
        title,
        description,
        topic,
        thumbnail,
        isPublic,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        questions: {
          create: questions.map((question, index) => ({
            title: question.title,
            description: question.description || "",
            type: question.type,
            showInTable: question.showInTable || false,
            order: question.order !== undefined ? question.order : index,
            isRequired: question.isRequired || false,
          })),
        },
        tags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        questions: {
          orderBy: {
            order: "asc",
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            forms: true,
            comments: true,
            likes: true,
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
