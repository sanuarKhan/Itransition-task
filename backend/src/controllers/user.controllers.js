const db = require("../db/db");

const getAllUsersCTRL = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const users = await db.user.findMany({
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

    const total = await db.user.count({ where });

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
};

const searchUsersCTRL = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }

    const users = await db.user.findMany({
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
};

const getUserProfileCTRL = async (req, res) => {
  try {
    const user = await db.user.findUnique({
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
};

const blockUnblockUserCTRL = async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot block yourself" });
    }

    const user = await db.user.update({
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
};

const updateUserRoleCTRL = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await db.user.update({
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
};

const deleteUserCTRL = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    await db.user.delete({
      where: { id: userId },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserStatsCTRL = async (req, res) => {
  try {
    const [totalUsers, activeUsers, blockedUsers, adminUsers] =
      await Promise.all([
        db.user.count(),
        db.user.count({ where: { isBlocked: false } }),
        db.user.count({ where: { isBlocked: true } }),
        db.user.count({ where: { role: "ADMIN" } }),
      ]);

    // Recent registrations
    const recentUsers = await db.user.findMany({
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
    const usersByMonth = await db.$queryRaw`
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
};

const getDashboardStatsCTRL = async (req, res) => {
  try {
    const [templatesCount, formsCount, commentsCount, likesCount] =
      await Promise.all([
        db.template.count({ where: { ownerId: req.user.id } }),
        db.form.count({ where: { userId: req.user.id } }),
        db.comment.count({ where: { userId: req.user.id } }),
        db.like.count({ where: { userId: req.user.id } }),
      ]);

    // Recent templates
    const recentTemplates = await db.template.findMany({
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
    const recentForms = await db.form.findMany({
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
};

module.exports = {
  getAllUsersCTRL,
  searchUsersCTRL,
  getUserProfileCTRL,
  blockUnblockUserCTRL,
  updateUserRoleCTRL,
  deleteUserCTRL,
  getUserStatsCTRL,
  getDashboardStatsCTRL,
};
