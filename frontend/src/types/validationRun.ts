export type RunStatus = "pending" | "running" | "passed" | "failed" | "cancelled";

export type ValidationRun = {
  id: string;
  scenario: string | null;
  target_type: "platform" | "application" | "dut";
  target_id: string;
  status: RunStatus;
  progress: number;
  started_at: string;
  ended_at: string | null;
  score: number | null;
  report_url: string;
  triggered_by: string;
};

export type LogEntry = { time: string; level: string; message: string };

export type WsMessage =
  | { type: "progress"; payload: { progress: number; status: RunStatus } }
  | { type: "log"; payload: LogEntry }
  | { type: "metric"; payload: { key: string; value: number } }
  | { type: "completed"; payload: { score: number | null; report_url: string } };
