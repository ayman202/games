import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.game.upsert({
    where: { slug: "sample-game" },
    update: {},
    create: {
      title: "Sample Game",
      slug: "sample-game",
      description: "This is a sample entry so you can see how a game page looks. Edit or delete it from the admin panel.",
      coverImage: "https://placehold.co/600x800?text=Cover",
      version: "1.0.0",
      sizeLabel: "12 GB",
      category: "Action",
      links: {
        create: [{ label: "Direct Download", url: "https://example.com/download" }],
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
