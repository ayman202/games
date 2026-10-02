import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AccountForm from "@/components/AccountForm";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My account</h1>
      <AccountForm name={admin.name} email={admin.email} />
    </div>
  );
}
