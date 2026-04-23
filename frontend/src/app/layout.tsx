import type { Metadata } from "next";
import type { ReactNode } from "react";

import { QueryProvider } from "@/providers/QueryProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "智慧驗證 tester",
  description: "O-RAN 資料與 AI 效能驗證儀表板",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
