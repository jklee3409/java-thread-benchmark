import { Suspense } from "react";
import { BenchmarkDashboard } from "@/widgets/benchmark-dashboard";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <BenchmarkDashboard />
    </Suspense>
  );
}
