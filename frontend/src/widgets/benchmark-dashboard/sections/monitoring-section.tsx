import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import {
  GrafanaEmbedPanel,
  ObservabilityLinksPanel,
} from "@/features/monitoring";

type MonitoringSectionProps = {
  compact?: boolean;
  showDedicatedLink?: boolean;
};

export function MonitoringSection({
  compact = false,
  showDedicatedLink = true,
}: MonitoringSectionProps) {
  return (
    <section
      className={cn(
        "dashboard-section",
        "monitoring-section",
        compact && "monitoring-section--compact",
      )}
      id="monitoring"
    >
      {showDedicatedLink ? (
        <div className="monitoring-actions">
          <Link href="/monitoring" className="secondary">
            Full Screen
          </Link>
        </div>
      ) : null}

      <div className={cn("monitoring-layout", compact && "monitoring-layout--compact")}>
        <GrafanaEmbedPanel compact={compact} />
        <ObservabilityLinksPanel />
      </div>
    </section>
  );
}
