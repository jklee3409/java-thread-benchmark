import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thread Bench Lab",
  description: "Virtual Thread와 Platform Thread 비교를 위한 성능 실험 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
