import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thread Benchmark Console",
  description: "Virtual Thread vs Platform Thread benchmark orchestration console",
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
