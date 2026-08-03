/**
 * Rupiah Formatting and Calculations Utility
 */

export function formatRp(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString("id-ID");
  const sign = amount < 0 ? "-" : "";
  return `${sign}Rp ${formatted}`;
}

export function formatRpCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "+";
  
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(0)}k`;
  }
  return `${sign}${abs}`;
}

export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
