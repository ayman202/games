import { getSettings } from "@/lib/settings";
import { updateSettings } from "@/app/actions/settings";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") redirect("/admin");

  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site settings</h1>
      <form action={updateSettings} className="flex flex-col gap-4 max-w-lg">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Site name</label>
          <input name="siteName" defaultValue={settings.siteName} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
          <input name="logoUrl" defaultValue={settings.logoUrl || ""} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Primary color</label>
          <input name="primaryColor" type="color" defaultValue={settings.primaryColor} className="w-20 h-10 bg-black/30 border border-white/10 rounded-lg" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenanceMode} />
          Maintenance mode (site shows a "back soon" page to visitors)
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="allowRegistration" defaultChecked={settings.allowRegistration} />
          Allow new visitor registrations
        </label>

        <details className="card p-3">
          <summary className="cursor-pointer text-sm text-gray-300">Ad slots (paste your ad network's embed code)</summary>
          <div className="mt-3 flex flex-col gap-3">
            <textarea name="adSlotHeader" defaultValue={settings.adSlotHeader || ""} placeholder="Header ad code" rows={2} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent font-mono text-xs" />
            <textarea name="adSlotSidebar" defaultValue={settings.adSlotSidebar || ""} placeholder="Sidebar ad code" rows={2} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent font-mono text-xs" />
            <textarea name="adSlotFooter" defaultValue={settings.adSlotFooter || ""} placeholder="Footer ad code" rows={2} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent font-mono text-xs" />
          </div>
        </details>

        <button className="bg-accent rounded-lg py-2 font-semibold">Save settings</button>
      </form>
    </div>
  );
}
