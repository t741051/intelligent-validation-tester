import { notFound } from "next/navigation";

import { DutManagementContainer } from "@/components/Dut/DutManagementContainer";
import type { DutType } from "@/types/common";

const MAP: Record<string, DutType> = {
  smo: "SMO",
  ric: "RIC",
  xapp: "xApp",
  rapp: "rApp",
};

export default async function InterfaceValidationPage({
  params,
}: {
  params: Promise<{ dutType: string }>;
}) {
  const { dutType } = await params;
  const mapped = MAP[dutType.toLowerCase()];
  if (!mapped) notFound();
  return <DutManagementContainer dutType={mapped} />;
}
