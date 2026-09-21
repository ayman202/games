import { getSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  return new Response(settings.adsTxtContent || "", {
    headers: { "Content-Type": "text/plain" },
  });
}
