import { guardMaintenance } from "@/lib/maintenance";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage() {
  await guardMaintenance();
  return <RegisterForm />;
}
