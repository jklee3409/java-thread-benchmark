import { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type PanelProps = PropsWithChildren<ComponentPropsWithoutRef<"section">>;

export function Panel({ className, children, ...props }: PanelProps) {
  return (
    <section {...props} className={cn("panel", className)}>
      {children}
    </section>
  );
}
