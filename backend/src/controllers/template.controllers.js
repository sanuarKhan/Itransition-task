const db = require("../db/db");

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
const getSingletemplate = async (req, res) => {
  try {
    const template = await db.template.findUnique({
      where: { id: req.params.id },
      include: {
        owner: {
          select: { id: true, name: true, avatar: true },
        },
        questions: {
          orderBy: { order: "asc" },
        },
        tags: {
          include: { tag: true },
        },
        allowedUsers: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        _count: {
          select: { forms: true, likes: true, comments: true },
        },
        likes: req.user
          ? {
              where: { userId: req.user.id },
              select: { id: true },
            }
          : false,
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Check access permissions
    const hasAccess =
      template.isPublic ||
      (req.user && req.user.id === template.ownerId) ||
      (req.user &&
        template.allowedUsers.some(
          (access) => access.user.id === req.user.id
        )) ||
      (req.user && req.user.role === "ADMIN");

    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ template });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const createTemplate = async (req, res) => {
  try {
    const {
      title,
      description,
      topic,
      thumbnail,
      tags,
      isPublic,
      allowedUserIds,
    } = req.body;

    if (!title || !description || !topic) {
      return res.status(400).json({
        error: "Title, description, and topic are required",
      });
    }

    const template = await db.template.create({
      data: {
        title,
        description,
        topic,
        thumbnail: thumbnail || null,
        isPublic,
        ownerId: req.user.id,
        tags: {
          create:
            tags?.map((tag) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tag },
                  create: { name: tag },
                },
              },
            })) || [],
        },
        allowedUsers: allowedUserIds?.length
          ? {
              create: allowedUserIds.map((id) => ({ userId: id })),
            }
          : undefined,
      },
      include: {
        owner: {
          select: { id: true, name: true, img: true },
        },
        tags: {
          include: { tag: true },
        },
        questions: true,
        allowedUsers: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    res.status(201).json({
      message: "Template created successfully",
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updatedTemplate = async (req, res) => {
  try {
    const { title, description, topic, image, tags, isPublic, allowedUserIds } =
      req.body;

    // Check if template exists and user has permission
    const existingTemplate = await db.template.findUnique({
      where: { id: req.params.id },
      include: {
        tags: { include: { tag: true } },
        allowedUsers: true,
      },
    });

    if (!existingTemplate) {
      return res.status(404).json({ error: "Template not found" });
    }

    const canEdit =
      existingTemplate.ownerId === req.user.id || req.user.role === "ADMIN";

    if (!canEdit) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update template in transaction to handle tags and allowed users properly
    const template = await db.$transaction(async (tx) => {
      // First, delete existing tags if new tags are provided
      if (tags) {
        await tx.tagOnTemplate.deleteMany({
          where: { templateId: req.params.id },
        });
      }

      // Delete existing allowed users if new ones are provided
      if (allowedUserIds) {
        await tx.templateAccess.deleteMany({
          where: { templateId: req.params.id },
        });
      }

      // Then update the template
      return await tx.template.update({
        where: { id: req.params.id },
        data: {
          title,
          description,
          topic,
          image: image || null,
          isPublic,
          ...(tags && {
            tags: {
              create: tags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tag },
                    create: { name: tag },
                  },
                },
              })),
            },
          }),
          ...(allowedUserIds && {
            allowedUsers: {
              create: allowedUserIds.map((userId) => ({ userId })),
            },
          }),
        },
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
          allowedUsers: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      });
    });

    res.json({
      message: "Template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateTemplateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: "Questions must be an array" });
    }

    // Check if template exists and user has permission
    const template = await db.template.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const canEdit =
      template.ownerId === req.user.id || req.user.role === "ADMIN";

    if (!canEdit) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Validate questions
    const typeCounts = {
      SINGLE_LINE: 0,
      MULTI_LINE: 0,
      INTEGER: 0,
      CHECKBOX: 0,
    };

    for (const question of questions) {
      if (!question.title?.trim()) {
        return res.status(400).json({
          error: "All questions must have a title",
        });
      }

      if (
        !["SINGLE_LINE", "MULTI_LINE", "INTEGER", "CHECKBOX"].includes(
          question.type
        )
      ) {
        return res.status(400).json({
          error: "Invalid question type",
        });
      }

      typeCounts[question.type]++;
    }

    // Business rule: max 4 of each type
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > 4) {
        return res.status(400).json({
          error: `Maximum 4 questions of type ${type} allowed`,
        });
      }
    }

    // Update questions in transaction
    await db.$transaction(async (tx) => {
      // Delete existing questions
      await tx.question.deleteMany({
        where: { templateId: req.params.id },
      });

      // Create new questions
      if (questions.length > 0) {
        await tx.question.createMany({
          data: questions.map((q, index) => ({
            templateId: req.params.id,
            title: q.title.trim(),
            description: q.description?.trim() || null,
            type: q.type,
            order: index + 1,
            showInTable: q.showInTable || false,
            isRequired: q.isRequired || false,
          })),
        });
      }
    });

    // Return updated template with questions
    const updatedTemplate = await db.template.findUnique({
      where: { id: req.params.id },
      include: {
        questions: { orderBy: { order: "asc" } },
        owner: { select: { id: true, name: true, avatar: true } },
        tags: { include: { tag: true } },
      },
    });

    res.json({
      message: "Questions updated successfully",
      template: updatedTemplate,
    });
  } catch (error) {
    console.error("Update questions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const template = await db.template.findUnique({
      where: { id: req.params.id },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const canDelete =
      template.ownerId === req.user.id || req.user.role === "ADMIN";

    if (!canDelete) {
      return res.status(403).json({ error: "Access denied" });
    }

    await db.template.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Template deleted successfully" });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTemplateResults = async (req, res) => {
  try {
    const template = await db.template.findUnique({
      where: { id: req.params.id },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const canView =
      template.ownerId === req.user.id || req.user.role === "ADMIN";

    if (!canView) {
      return res.status(403).json({ error: "Access denied" });
    }

    const forms = await db.form.findMany({
      where: { templateId: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ forms });
  } catch (error) {
    console.error("Get template results error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTemplateAnalytics = async (req, res) => {
  try {
    const template = await db.template.findUnique({
      where: { id: req.params.id },
      include: { questions: true },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const canView =
      template.ownerId === req.user.id || req.user.role === "ADMIN";

    if (!canView) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get analytics data
    const forms = await db.form.findMany({
      where: { templateId: req.params.id },
      include: {
        answers: {
          include: { question: true },
        },
      },
    });

    const analytics = {
      totalResponses: forms.length,
      responsesByDate: {},
      questionAnalytics: {},
    };

    // Group responses by date
    forms.forEach((form) => {
      const date = form.createdAt.toISOString().split("T")[0];
      analytics.responsesByDate[date] =
        (analytics.responsesByDate[date] || 0) + 1;
    });

    // Analyze each question
    template.questions.forEach((question) => {
      const answers = forms
        .flatMap((form) => form.answers)
        .filter((answer) => answer.questionId === question.id);

      analytics.questionAnalytics[question.id] = {
        question: question.title,
        type: question.type,
        totalAnswers: answers.length,
        answers: answers.map((a) => ({
          value: a.valueText || a.valueInt || a.valueBool,
          createdAt: a.createdAt,
        })),
      };

      // Type-specific analytics
      if (question.type === "INTEGER") {
        const numbers = answers
          .map((a) => a.valueInt)
          .filter((n) => n !== null);
        if (numbers.length > 0) {
          analytics.questionAnalytics[question.id].average =
            numbers.reduce((a, b) => a + b, 0) / numbers.length;
          analytics.questionAnalytics[question.id].min = Math.min(...numbers);
          analytics.questionAnalytics[question.id].max = Math.max(...numbers);
        }
      }

      if (question.type === "CHECKBOX") {
        const trueCount = answers.filter((a) => a.valueBool === true).length;
        analytics.questionAnalytics[question.id].truePercentage =
          answers.length > 0 ? (trueCount / answers.length) * 100 : 0;
      }
    });

    res.json({ analytics });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const toggleTemplateLike = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Check if already liked
    const existingLike = await db.like.findUnique({
      where: {
        templateId_userId: { templateId, userId },
      },
    });

    if (existingLike) {
      // Unlike
      await db.like.delete({
        where: { id: existingLike.id },
      });
      res.json({ message: "Template unliked", liked: false });
    } else {
      // Like
      await db.like.create({
        data: { templateId, userId },
      });
      res.json({ message: "Template liked", liked: true });
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addTemplateComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const template = await db.template.findUnique({
      where: { id: req.params.id },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        templateId: req.params.id,
        userId: req.user.id,
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTemplateComments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await db.comment.findMany({
      where: { templateId: req.params.id },
      include: {
        user: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: parseInt(limit),
    });

    const total = await db.comment.count({
      where: { templateId: req.params.id },
    });

    res.json({
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getPublicTemplates,
  getMyTemplates,
  createTemplate,
  getSingletemplate,
  updatedTemplate,
  updateTemplateQuestions,
  deleteTemplate,
  getTemplateResults,
  getTemplateAnalytics,
  toggleTemplateLike,
  addTemplateComment,
  getTemplateComments,
};
