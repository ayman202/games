import { getSettings } from "@/lib/settings";
import { redirect } from "next/navigation";

export async function guardMaintenance() {
  const settings = await getSettings();
  if (settings.maintenanceMode) redirect("/maintenance");
}
