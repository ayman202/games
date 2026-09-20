import { getSettings } from "@/lib/settings";

export default async function MaintenancePage() {
  const settings = await getSettings();
  return (
    <div className="max-w-md mx-auto text-center mt-24">
      <h1 className="text-2xl font-bold mb-3">{settings.siteName} is down for maintenance</h1>
      <p className="text-gray-400">We'll be back shortly. Thanks for your patience.</p>
    </div>
  );
}
