import { MonitoringSection } from "@/widgets/benchmark-dashboard/sections/monitoring-section";

export default function MonitoringPage() {
  return (
    <div className="page-stack page-stack--fill">
      <MonitoringSection showDedicatedLink={false} />
    </div>
  );
}
