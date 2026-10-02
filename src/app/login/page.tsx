import { guardMaintenance } from "@/lib/maintenance";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  await guardMaintenance();
  return <LoginForm />;
}
