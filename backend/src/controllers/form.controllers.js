const db = require("../db/db");

const getMyFormsCTRL = async (req, res) => {
  try {
    const forms = await db.form.findMany({
      where: { userId: req.user.id },
      include: {
        template: {
          select: {
            id: true,
            title: true,
            description: true,
            topic: true,
            owner: {
              select: { id: true, name: true },
            },
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
                type: true,
                showInTable: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.json({ forms });
  } catch (error) {
    console.error("Get my forms error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFormByIdCTRL = async (req, res) => {
  try {
    const form = await db.form.findUnique({
      where: { id: req.params.id },
      include: {
        template: {
          include: {
            owner: {
              select: { id: true, name: true },
            },
            questions: {
              orderBy: { order: "asc" },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Check permissions
    const canView =
      form.userId === req.user.id ||
      form.template.ownerId === req.user.id ||
      req.user.role === "ADMIN";

    if (!canView) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ form });
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkFormExistsCTRL = async (req, res) => {
  try {
    const form = await db.form.findUnique({
      where: {
        templateId_userId: {
          templateId: req.params.templateId,
          userId: req.user.id,
        },
      },
      include: {
        answers: {
          include: {
            question: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    res.json({
      hasFilled: !!form,
      form: form || null,
    });
  } catch (error) {
    console.error("Check form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const submitFormCTRL = async (req, res) => {
  try {
    const { answers } = req.body;
    const templateId = req.params.templateId;

    // Check if template exists
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        questions: true,
        allowedUsers: true,
      },
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Check access permissions
    const hasAccess =
      template.isPublic ||
      req.user.role === "ADMIN" ||
      template.ownerId === req.user.id ||
      template.allowedUsers.some((au) => au.userId === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied to this template" });
    }

    // Check if user already submitted
    const existingForm = await db.form.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: req.user.id,
        },
      },
    });

    if (existingForm) {
      return res
        .status(400)
        .json({ error: "You have already submitted this form" });
    }

    // Validate answers
    const questionMap = new Map(template.questions.map((q) => [q.id, q]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return res.status(400).json({ error: "Invalid question ID" });
      }

      // Check required questions
      if (question.isRequired) {
        const hasValue =
          answer.valueText ||
          answer.valueInt !== null ||
          answer.valueBool !== null;
        if (!hasValue) {
          return res.status(400).json({
            error: `Question "${question.title}" is required`,
          });
        }
      }

      // Validate data types
      if (question.type === "INTEGER" && answer.valueInt !== null) {
        if (answer.valueInt < 0) {
          return res.status(400).json({
            error: `Question "${question.title}" must be a non-negative integer`,
          });
        }
      }
    }

    // Create form and answers
    const form = await db.form.create({
      data: {
        templateId,
        userId: req.user.id,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            valueText: answer.valueText || null,
            valueInt: answer.valueInt || null,
            valueBool: answer.valueBool || null,
          })),
        },
      },
      include: {
        template: {
          select: { id: true, title: true },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    res.status(201).json({
      message: "Form submitted successfully",
      form,
    });
  } catch (error) {
    console.error("Submit form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateFormCTRL = async (req, res) => {
  try {
    const { answers } = req.body;

    const form = await db.form.findUnique({
      where: { id: req.params.id },
      include: {
        template: {
          include: { questions: true },
        },
      },
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Check permissions
    const canEdit =
      form.userId === req.user.id ||
      form.template.ownerId === req.user.id ||
      req.user.role === "ADMIN";

    if (!canEdit) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Validate answers
    const questionMap = new Map(form.template.questions.map((q) => [q.id, q]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return res.status(400).json({ error: "Invalid question ID" });
      }

      // Check required questions
      if (question.isRequired) {
        const hasValue =
          answer.valueText ||
          answer.valueInt !== null ||
          answer.valueBool !== null;
        if (!hasValue) {
          return res.status(400).json({
            error: `Question "${question.title}" is required`,
          });
        }
      }

      // Validate data types
      if (question.type === "INTEGER" && answer.valueInt !== null) {
        if (answer.valueInt < 0) {
          return res.status(400).json({
            error: `Question "${question.title}" must be a non-negative integer`,
          });
        }
      }
    }

    // Delete existing answers
    await db.answer.deleteMany({
      where: { formId: req.params.id },
    });

    // Create new answers
    await db.answer.createMany({
      data: answers.map((answer) => ({
        formId: req.params.id,
        questionId: answer.questionId,
        valueText: answer.valueText || null,
        valueInt: answer.valueInt || null,
        valueBool: answer.valueBool || null,
      })),
    });

    // Fetch updated form
    const updatedForm = await db.form.findUnique({
      where: { id: req.params.id },
      include: {
        template: {
          select: { id: true, title: true },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    res.json({
      message: "Form updated successfully",
      form: updatedForm,
    });
  } catch (error) {
    console.error("Update form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFormCTRL = async (req, res) => {
  try {
    const form = await db.form.findUnique({
      where: { id: req.params.id },
      include: {
        template: {
          select: { ownerId: true },
        },
      },
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Check permissions
    const canDelete =
      form.userId === req.user.id ||
      form.template.ownerId === req.user.id ||
      req.user.role === "ADMIN";

    if (!canDelete) {
      return res.status(403).json({ error: "Access denied" });
    }

    await db.form.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFormStatsCTRL = async (req, res) => {
  try {
    const [totalForms, myForms, recentForms] = await Promise.all([
      db.form.count({
        where: { userId: req.user.id },
      }),
      db.form.findMany({
        where: { userId: req.user.id },
        include: {
          template: {
            select: { id: true, title: true, topic: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.form.findMany({
        where: { userId: req.user.id },
        include: {
          template: {
            select: { id: true, title: true, topic: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    // Forms by topic
    const formsByTopic = await db.form.groupBy({
      by: ["template.topic"],
      where: { userId: req.user.id },
      _count: true,
    });

    res.json({
      totalForms,
      recentForms,
      formsByTopic,
    });
  } catch (error) {
    console.error("Get form stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getMyFormsCTRL,
  getFormByIdCTRL,
  checkFormExistsCTRL,
  submitFormCTRL,
  updateFormCTRL,
  deleteFormCTRL,
  getFormStatsCTRL,
};
