"use client";
import { useEffect, useState } from "react";

import type { LogEntry, RunStatus, WsMessage } from "@/types/validationRun";

const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE ?? "ws://localhost:8001/ws";

export function useRunStream(runId: string | null) {
  const [status, setStatus] = useState<RunStatus>("pending");
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [reportUrl, setReportUrl] = useState("");

  useEffect(() => {
    if (!runId) return;
    const ws = new WebSocket(`${WS_BASE}/runs/${runId}/`);
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data) as WsMessage;
      if (msg.type === "progress") {
        setStatus(msg.payload.status);
        setProgress(msg.payload.progress);
      } else if (msg.type === "log") {
        setLogs((prev) => [...prev, msg.payload]);
      } else if (msg.type === "metric") {
        setMetrics((prev) => ({ ...prev, [msg.payload.key]: msg.payload.value }));
      } else if (msg.type === "completed") {
        setStatus(msg.payload.score != null && msg.payload.score >= 80 ? "passed" : "failed");
        setProgress(100);
        setReportUrl(msg.payload.report_url);
      }
    };
    return () => ws.close();
  }, [runId]);

  return { status, progress, metrics, logs, reportUrl };
}
