const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    //TODO: need to study
    where: { email: "admin@formcraft.com" },
    update: {},
    create: {
      email: "admin@formcraft.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
      lang: "EN",
      theme: "LIGHT",
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@formcraft.com" },
    update: {},
    create: {
      email: "user@formcraft.com",
      password: userPassword,
      name: "Test User",
      role: "USER",
      lang: "EN",
      theme: "LIGHT",
    },
  });

  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: "feedback" },
      update: {},
      create: { name: "feedback" },
    }),
    prisma.tag.upsert({
      where: { name: "survey" },
      update: {},
      create: { name: "survey" },
    }),
    prisma.tag.upsert({
      where: { name: "quiz" },
      update: {},
      create: { name: "quiz" },
    }),
    prisma.tag.upsert({
      where: { name: "job" },
      update: {},
      create: { name: "job" },
    }),
    prisma.tag.upsert({
      where: { name: "education" },
      update: {},
      create: { name: "education" },
    }),
  ]);

  // Create sample template
  const template = await prisma.template.create({
    data: {
      title: "Customer Feedback Survey",
      description:
        "# Welcome to our feedback survey!\n\nWe value your opinion and would love to hear about your experience with our service. Your feedback helps us improve and serve you better.\n\n**Please take a few minutes to answer the following questions.**",
      topic: "SURVEY",
      isPublic: true,
      ownerId: user.id,
      tags: {
        create: [
          { tag: { connect: { name: "feedback" } } },
          { tag: { connect: { name: "survey" } } },
        ],
      },
      questions: {
        create: [
          {
            title: "Your Name",
            description: "Please enter your full name",
            type: "SINGLE_LINE",
            order: 0,
            showInTable: true,
            isRequired: true,
          },
          {
            title: "How would you rate our service?",
            description: "Rate from 1 to 10",
            type: "INTEGER",
            order: 1,
            showInTable: true,
            isRequired: true,
          },
          {
            title: "Additional Comments",
            description: "Please share any additional feedback or suggestions",
            type: "MULTI_LINE",
            order: 2,
            showInTable: false,
            isRequired: false,
          },
          {
            title: "Would you recommend us to others?",
            description: "Check if you would recommend our service",
            type: "CHECKBOX",
            order: 3,
            showInTable: true,
            isRequired: false,
          },
        ],
      },
    },
    include: { questions: true },
  });

  // Create sample form submission
  await prisma.form.create({
    data: {
      templateId: template.id,
      userId: admin.id,
      answers: {
        create: [
          {
            questionId: template.questions[0].id,
            valueText: "John Doe",
          },
          {
            questionId: template.questions[1].id,
            valueInt: 9,
          },
          {
            questionId: template.questions[2].id,
            valueText: "Great service! Very satisfied with the experience.",
          },
          {
            questionId: template.questions[3].id,
            valueBool: true,
          },
        ],
      },
    },
  });

  // Add a comment and like
  await prisma.comment.create({
    data: {
      templateId: template.id,
      userId: admin.id,
      content: "This is a great template for collecting customer feedback!",
    },
  });

  await prisma.like.create({
    data: {
      templateId: template.id,
      userId: admin.id,
    },
  });

  console.log("✅ Database seeding completed!");
  console.log("👤 Admin user: admin@formcraft.com / admin123");
  console.log("👤 Test user: user@formcraft.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
