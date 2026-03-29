import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/shared/ui/app-shell";

export const metadata: Metadata = {
  title: "Java Thread Benchmark Console",
  description:
    "Java 21 가상 스레드와 플랫폼 스레드 성능을 비교하고 모니터링하는 실험 콘솔입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
