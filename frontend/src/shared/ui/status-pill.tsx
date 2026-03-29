import { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type StatusPillProps = PropsWithChildren<{
  tone?: "neutral" | "accent" | "success" | "danger";
}>;

export function StatusPill({
  tone = "neutral",
  children,
}: StatusPillProps) {
  return (
    <span className={cn("status-pill", `status-pill--${tone}`)}>{children}</span>
  );
}
