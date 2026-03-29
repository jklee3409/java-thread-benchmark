import { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type PanelProps = PropsWithChildren<{
  className?: string;
}>;

export function Panel({ className, children }: PanelProps) {
  return <section className={cn("panel", className)}>{children}</section>;
}
