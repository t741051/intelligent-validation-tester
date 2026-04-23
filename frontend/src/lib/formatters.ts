export function formatPercent(n: number | null | undefined, digits = 1): string {
  if (n == null) return "--";
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatScore(n: number | null | undefined): string {
  if (n == null) return "--";
  return n.toFixed(1);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "--";
  return new Date(iso).toLocaleString("zh-TW");
}
