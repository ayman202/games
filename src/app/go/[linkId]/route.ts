import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { linkId: string } }) {
  const link = await prisma.downloadLink.findUnique({ where: { id: params.linkId } });

  if (!link) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  await prisma.$transaction([
    prisma.downloadLink.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }),
    prisma.game.update({ where: { id: link.gameId }, data: { downloadCount: { increment: 1 } } }),
  ]);

  return NextResponse.redirect(link.url);
}
