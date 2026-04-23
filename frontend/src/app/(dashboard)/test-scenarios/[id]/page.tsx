import { ScenarioDetailContainer } from "@/components/Scenario/ScenarioDetailContainer";

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ScenarioDetailContainer id={id} />;
}
