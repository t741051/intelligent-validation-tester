import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">智慧驗證 tester</h1>
        <p className="text-lg md:text-xl text-gray-600">
          O-RAN 架構下的資料準確性與 AI 效能驗證儀表板
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/login">登入</Link></Button>
          <Button variant="outline" asChild>
            <a href="/api/docs/" target="_blank" rel="noreferrer">API 文件</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
