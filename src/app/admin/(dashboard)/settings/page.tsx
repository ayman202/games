import { getSettings } from "@/lib/settings";
import { updateSettings } from "@/app/actions/settings";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const inputCls = "w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent";
const labelCls = "block text-sm text-gray-400 mb-1";

export default async function SettingsPage() {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") redirect("/admin");

  const s = await getSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site settings</h1>
      <form action={updateSettings} className="flex flex-col gap-6 max-w-2xl">

        <section className="card p-4">
          <h2 className="font-semibold mb-3">General</h2>
          <div className="flex flex-col gap-3">
            <div><label className={labelCls}>Site name</label><input name="siteName" defaultValue={s.siteName} className={inputCls} /></div>
            <div><label className={labelCls}>Site description</label><textarea name="siteDescription" defaultValue={s.siteDescription || ""} rows={2} className={inputCls} /></div>
            <div><label className={labelCls}>Logo URL</label><input name="logoUrl" defaultValue={s.logoUrl || ""} className={inputCls} /></div>
            <div><label className={labelCls}>Favicon URL</label><input name="faviconUrl" defaultValue={s.faviconUrl || ""} className={inputCls} /></div>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Appearance</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><label className={labelCls}>Primary color</label><input type="color" name="primaryColor" defaultValue={s.primaryColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Secondary color</label><input type="color" name="secondaryColor" defaultValue={s.secondaryColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Background color</label><input type="color" name="backgroundColor" defaultValue={s.backgroundColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
          </div>
          <div>
            <label className={labelCls}>Default theme</label>
            <select name="defaultTheme" defaultValue={s.defaultTheme} className={inputCls}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm mt-3">
            <input type="checkbox" name="allowThemeToggle" defaultChecked={s.allowThemeToggle} />
            Let visitors switch between dark and light
          </label>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Header</h2>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="showContactInHeader" defaultChecked={s.showContactInHeader} /> Show "Contact" link
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showCategoriesInHeader" defaultChecked={s.showCategoriesInHeader} /> Show category links instead
          </label>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Footer</h2>
          <label className={labelCls}>Footer text (defaults to a copyright line if left blank)</label>
          <input name="footerText" defaultValue={s.footerText || ""} className={inputCls} />
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Social links</h2>
          <div className="flex flex-col gap-3">
            <input name="socialFacebook" defaultValue={s.socialFacebook || ""} placeholder="Facebook URL" className={inputCls} />
            <input name="socialTwitter" defaultValue={s.socialTwitter || ""} placeholder="X / Twitter URL" className={inputCls} />
            <input name="socialInstagram" defaultValue={s.socialInstagram || ""} placeholder="Instagram URL" className={inputCls} />
            <input name="socialYoutube" defaultValue={s.socialYoutube || ""} placeholder="YouTube URL" className={inputCls} />
            <input name="socialDiscord" defaultValue={s.socialDiscord || ""} placeholder="Discord URL" className={inputCls} />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">SEO defaults</h2>
          <div className="flex flex-col gap-3">
            <input name="seoDefaultTitle" defaultValue={s.seoDefaultTitle || ""} placeholder="Default meta title" className={inputCls} />
            <textarea name="seoDefaultDescription" defaultValue={s.seoDefaultDescription || ""} placeholder="Default meta description" rows={2} className={inputCls} />
            <input name="seoKeywords" defaultValue={s.seoKeywords || ""} placeholder="Keywords, comma, separated" className={inputCls} />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Behavior</h2>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="maintenanceMode" defaultChecked={s.maintenanceMode} /> Maintenance mode
          </label>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="allowRegistration" defaultChecked={s.allowRegistration} /> Allow new visitor registrations
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="allowReviews" defaultChecked={s.allowReviews} /> Allow reviews/comments on games
          </label>
        </section>

        <details className="card p-4">
          <summary className="cursor-pointer font-semibold">Ad slots (paste your ad network's embed code)</summary>
          <div className="mt-3 flex flex-col gap-3">
            <textarea name="adSlotHeader" defaultValue={s.adSlotHeader || ""} placeholder="Header ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotSidebar" defaultValue={s.adSlotSidebar || ""} placeholder="Sidebar ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotFooter" defaultValue={s.adSlotFooter || ""} placeholder="Footer ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
          </div>
        </details>

        <button className="bg-accent rounded-lg py-2 font-semibold">Save settings</button>
      </form>
    </div>
  );
}
