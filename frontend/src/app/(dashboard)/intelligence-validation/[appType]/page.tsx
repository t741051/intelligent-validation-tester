import { PageHeader } from "@/components/common/PageHeader";

export default async function IntelligenceValidationPage({
  params,
}: {
  params: Promise<{ appType: string }>;
}) {
  const { appType } = await params;
  return (
    <>
      <PageHeader title={`智慧程度驗證 - ${appType}`} />
      <p className="text-white/60">待實作:應用提交 + AI Case 選擇 + Baseline 比較圖。</p>
    </>
  );
}
