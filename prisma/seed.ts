import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Site settings (singleton row)
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // First Super Admin, from env vars
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const adminHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (adminEmail && adminHash) {
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: {},
      create: { name: "Super Admin", email: adminEmail, passwordHash: adminHash, role: "SUPER_ADMIN" },
    });
    console.log(`Super admin ready: ${adminEmail}`);
  } else {
    console.log("Skipped admin creation — set ADMIN_EMAIL and ADMIN_PASSWORD_HASH to seed one.");
  }

  // A starter category
  const category = await prisma.category.upsert({
    where: { slug: "action" },
    update: {},
    create: { name: "Action", slug: "action", icon: "🎮", order: 0 },
  });

  // A sample game so the library isn't empty on first run
  await prisma.game.upsert({
    where: { slug: "sample-game" },
    update: {},
    create: {
      title: "Sample Game",
      slug: "sample-game",
      description: "<p>This is a sample entry so you can see how a game page looks. Edit or delete it from the admin panel.</p>",
      coverImage: "https://placehold.co/600x800?text=Cover",
      version: "1.0.0",
      sizeLabel: "12 GB",
      status: "PUBLISHED",
      categoryId: category.id,
      links: {
        create: [{ label: "Direct Download", url: "https://example.com/download", provider: "direct" }],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
