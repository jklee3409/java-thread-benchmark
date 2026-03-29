import { cn } from "@/shared/lib/cn";

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: "neutral" | "accent" | "warning" | "success" | "danger";
};

export function MetricCard({
  label,
  value,
  helper,
  tone = "neutral",
}: MetricCardProps) {
  return (
    <div className={cn("metric-card", `metric-card--${tone}`)}>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <p className="metric-helper">{helper}</p> : null}
    </div>
  );
}
