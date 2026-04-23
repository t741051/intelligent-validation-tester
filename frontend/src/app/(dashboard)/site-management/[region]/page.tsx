import { SiteManagementContainer } from "@/components/Site/SiteManagementContainer";
import type { Region } from "@/types/common";

export default async function SiteManagementPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const normalized: Region = region === "international" ? "international" : "domestic";
  return <SiteManagementContainer region={normalized} />;
}
