import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

export default async function CatchAllRedirect({ params }: { params: { slug: string[] } }) {
  const fromPath = "/" + params.slug.join("/");

  const match = await prisma.redirect.findUnique({ where: { fromPath } });
  if (match) redirect(match.toPath);

  notFound();
}
