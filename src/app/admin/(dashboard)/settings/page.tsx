import { getSettings } from "@/lib/settings";
import { updateSettings, clearSiteCache } from "@/app/actions/settings";
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
          <h2 className="font-semibold mb-3">Appearance — Dark theme</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className={labelCls}>Primary color</label><input type="color" name="primaryColor" defaultValue={s.primaryColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Secondary color</label><input type="color" name="secondaryColor" defaultValue={s.secondaryColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Background color</label><input type="color" name="backgroundColor" defaultValue={s.backgroundColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Card/surface color</label><input type="color" name="surfaceColor" defaultValue={s.surfaceColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Appearance — Light theme</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className={labelCls}>Primary color</label><input type="color" name="lightPrimaryColor" defaultValue={s.lightPrimaryColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Secondary color</label><input type="color" name="lightSecondaryColor" defaultValue={s.lightSecondaryColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Background color</label><input type="color" name="lightBackgroundColor" defaultValue={s.lightBackgroundColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Card/surface color</label><input type="color" name="lightSurfaceColor" defaultValue={s.lightSurfaceColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
          </div>
          <div>
            <label className={labelCls}>Default theme for new visitors</label>
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
          <h2 className="font-semibold mb-3">Hero banner — Dark theme</h2>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelCls}>Background</label><input type="color" name="heroBackgroundColor" defaultValue={s.heroBackgroundColor} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Glow color 1</label><input type="color" name="heroBlob1Color" defaultValue={s.heroBlob1Color} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Glow color 2</label><input type="color" name="heroBlob2Color" defaultValue={s.heroBlob2Color} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
          </div>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Hero banner — Light theme</h2>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><label className={labelCls}>Background</label><input type="color" name="heroBackgroundColorLight" defaultValue={s.heroBackgroundColorLight} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Glow color 1</label><input type="color" name="heroBlob1ColorLight" defaultValue={s.heroBlob1ColorLight} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
            <div><label className={labelCls}>Glow color 2</label><input type="color" name="heroBlob2ColorLight" defaultValue={s.heroBlob2ColorLight} className="w-full h-10 bg-black/30 border border-white/10 rounded-lg" /></div>
          </div>
          <label className={labelCls}>Number of games shown in the rotating hero (most recently added)</label>
          <input type="number" min={1} max={20} name="heroImageCount" defaultValue={s.heroImageCount} className={inputCls} />
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
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="allowReviews" defaultChecked={s.allowReviews} /> Allow reviews/comments on games
          </label>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" name="showGameNotes" defaultChecked={s.showGameNotes} /> Show the "Note" box on game pages (when a game has one)
          </label>
          <div className="mb-2">
            <label className={labelCls}>Note box color</label>
            <input type="color" name="noteColor" defaultValue={s.noteColor} className="w-24 h-10 bg-black/30 border border-white/10 rounded-lg" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="enableCopyProtection" defaultChecked={s.enableCopyProtection} /> Block right-click and text copying on the site
          </label>
        </section>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Downloads</h2>
          <label className={labelCls}>Countdown wait before a download link is revealed (seconds)</label>
          <input type="number" min={0} max={60} name="downloadWaitSeconds" defaultValue={s.downloadWaitSeconds} className={inputCls} />
          <p className="text-xs text-gray-500 mt-2">
            Visitors land on a "your download is preparing" page for this many seconds before the
            real link appears — the two ad slots below show during that wait.
          </p>
        </section>

        <details className="card p-4">
          <summary className="cursor-pointer font-semibold">Ad slots (paste your ad network's embed code)</summary>
          <div className="mt-3 flex flex-col gap-3">
            <div>
              <label className={labelCls}>ads.txt content (from your AdSense account, once approved)</label>
              <textarea name="adsTxtContent" defaultValue={s.adsTxtContent || ""} placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0" rows={2} className={`${inputCls} font-mono text-xs`} />
              <p className="text-xs text-gray-500 mt-1">Served automatically at yoursite.com/ads.txt — required for AdSense.</p>
            </div>
            <textarea name="adSlotHeader" defaultValue={s.adSlotHeader || ""} placeholder="Header ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotSidebar" defaultValue={s.adSlotSidebar || ""} placeholder="Sidebar ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotFooter" defaultValue={s.adSlotFooter || ""} placeholder="Footer ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotDownloadTop" defaultValue={s.adSlotDownloadTop || ""} placeholder="Download-wait page — top ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotDownloadBottom" defaultValue={s.adSlotDownloadBottom || ""} placeholder="Download-wait page — bottom ad code" rows={2} className={`${inputCls} font-mono text-xs`} />
            <textarea name="adSlotHomeBetweenRows" defaultValue={s.adSlotHomeBetweenRows || ""} placeholder="Homepage — shown centered between category rows" rows={2} className={`${inputCls} font-mono text-xs`} />
          </div>
        </details>

        <section className="card p-4">
          <h2 className="font-semibold mb-3">Sitemap &amp; robots.txt</h2>
          <p className="text-xs text-gray-500 mb-3">
            Games, categories, and static pages are added to sitemap.xml automatically — use these
            only for extra URLs (e.g. from a previous site) or to block specific paths from search engines.
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelCls}>Extra sitemap URLs (one per line, e.g. /some-page)</label>
              <textarea name="sitemapExtraUrls" defaultValue={s.sitemapExtraUrls || ""} rows={2} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Extra robots.txt "Disallow" paths (one per line)</label>
              <textarea name="robotsExtraDisallow" defaultValue={s.robotsExtraDisallow || ""} rows={2} className={inputCls} />
            </div>
          </div>
        </section>

        <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold">Save settings</button>
      </form>

      <form action={clearSiteCache} className="mt-6">
        <button className="border border-white/15 hover:border-accent rounded-lg px-4 py-2 text-sm">
          🗑 Clear site cache
        </button>
        <p className="text-xs text-gray-500 mt-1">Forces every page to rebuild from the database on next visit — use after bulk database edits.</p>
      </form>
    </div>
  );
}
