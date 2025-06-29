const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = search
      ? {
          //TODO: need to study
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        language: true,
        theme: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            templates: true,
            forms: true,
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: parseInt(limit),
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search users for autocomplete
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
        isBlocked: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
      take: 10,
    });

    res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user profile
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        language: true,
        theme: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            templates: true,
            forms: true,
            comments: true,
            likes: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only allow viewing own profile or admin
    if (user.id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Block/unblock user (admin only)
router.put("/:id/block", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot block yourself" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBlocked },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        createdAt: true,
      },
    });

    res.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user,
    });
  } catch (error) {
    console.error("Block/unblock user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Promote/demote user to/from admin (admin only)
router.put("/:id/role", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isBlocked: true,
        createdAt: true,
      },
    });

    res.json({
      message: `User role updated to ${role} successfully`,
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete user (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user statistics (admin only)
router.get(
  "/stats/overview",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [totalUsers, activeUsers, blockedUsers, adminUsers] =
        await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { isBlocked: false } }),
          prisma.user.count({ where: { isBlocked: true } }),
          prisma.user.count({ where: { role: "ADMIN" } }),
        ]);

      // Recent registrations
      const recentUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      // User activity by month
      const usersByMonth = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as count
        FROM users 
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `;

      res.json({
        totalUsers,
        activeUsers,
        blockedUsers,
        adminUsers,
        recentUsers,
        usersByMonth,
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get dashboard data for regular users
router.get("/dashboard/stats", authenticateToken, async (req, res) => {
  try {
    const [templatesCount, formsCount, commentsCount, likesCount] =
      await Promise.all([
        prisma.template.count({ where: { ownerId: req.user.id } }),
        prisma.form.count({ where: { userId: req.user.id } }),
        prisma.comment.count({ where: { userId: req.user.id } }),
        prisma.like.count({ where: { userId: req.user.id } }),
      ]);

    // Recent templates
    const recentTemplates = await prisma.template.findMany({
      where: { ownerId: req.user.id },
      select: {
        id: true,
        title: true,
        topic: true,
        createdAt: true,
        _count: {
          select: { forms: true, likes: true, comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    // Recent forms
    const recentForms = await prisma.form.findMany({
      where: { userId: req.user.id },
      include: {
        template: {
          select: { id: true, title: true, topic: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    res.json({
      stats: {
        templatesCount,
        formsCount,
        commentsCount,
        likesCount,
      },
      recentTemplates,
      recentForms,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
