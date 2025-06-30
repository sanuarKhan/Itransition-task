const express = require("express");
const {
  authenticateToken,
  optionalAuth,
  requireAdmin,
} = require("../middleware/auth.middleware");
const {
  getPublicTemplates,
  getMyTemplates,
  createTemplate,
  getSingletemplate,
  updatedTemplate,
} = require("../controllers/template.controllers");

const router = express.Router();

router.get("/", optionalAuth, getPublicTemplates);
router.get("/my", authenticateToken, getMyTemplates);
router.get("/:id", optionalAuth, getSingletemplate);
router.post("/", authenticateToken, createTemplate);

// Update template - FIXED
router.put("/:id", authenticateToken, updatedTemplate);

// Update template questions - MAIN QUESTION FUNCTIONALITY
router.put("/:id/questions", authenticateToken);

// Delete template
router.delete("/:id", authenticateToken, async (req, res) => {
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
});

// Get template results (filled forms)
router.get("/:id/results", authenticateToken, async (req, res) => {
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
});

// Get template analytics
router.get("/:id/analytics", authenticateToken, async (req, res) => {
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
});

// Toggle like
router.post("/:id/like", authenticateToken, async (req, res) => {
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
});

// Add comment
router.post("/:id/comments", authenticateToken, async (req, res) => {
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
});

// Get template comments
router.get("/:id/comments", async (req, res) => {
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
});

module.exports = router;
