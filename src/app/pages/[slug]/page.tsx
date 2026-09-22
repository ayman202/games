import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await prisma.staticPage.findUnique({ where: { slug: params.slug } });
  return page ? { title: page.title } : {};
}

function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export default async function PublicStaticPage({ params }: { params: { slug: string } }) {
  const page = await prisma.staticPage.findUnique({ where: { slug: params.slug } });
  if (!page) notFound();

  const rtl = isArabic(page.title) || isArabic(page.content);

  return (
    <div dir={rtl ? "rtl" : "ltr"} className={`max-w-2xl ${rtl ? "text-right" : "text-left"}`}>
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}
