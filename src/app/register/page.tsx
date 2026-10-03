import { guardMaintenance } from "@/lib/maintenance";
import { getSettings } from "@/lib/settings";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage() {
  await guardMaintenance();
  const settings = await getSettings();

  if (!settings.allowRegistration) {
    return (
      <div className="max-w-sm mx-auto card p-6 mt-12 text-center">
        <h1 className="text-xl font-bold mb-2">Registration is closed</h1>
        <p className="text-gray-400 text-sm">
          New account registration has been paused by the site admin. Please check back later.
        </p>
      </div>
    );
  }

  return <RegisterForm />;
}
