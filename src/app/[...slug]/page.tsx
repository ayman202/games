import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { guardMaintenance } from "@/lib/maintenance";

export default async function CatchAllRedirect({ params }: { params: { slug: string[] } }) {
  await guardMaintenance();
  const fromPath = "/" + params.slug.join("/");

  const match = await prisma.redirect.findUnique({ where: { fromPath } });
  if (match) redirect(match.toPath);

  notFound();
}
