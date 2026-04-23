import type { Region } from "./common";

export type Environment = "indoor" | "outdoor";

export type Site = {
  id: string;
  name: string;
  region: Region;
  environment: Environment;
  address: string;
  location: { lat: number; lng: number } | null;
  floor_plan_url: string;
  created_at: string;
};

export type SiteInput = Omit<Site, "id" | "created_at">;

export type NodeType = "gnb" | "smo" | "ric";
export type StationStatus = "normal" | "warning" | "offline";

export type BaseStation = {
  id: string;
  site: string;
  code: string;
  name: string;
  node_type: NodeType;
  mgmt_ip: string | null;
  mgmt_port: number | null;
  vendor: string;
  model: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
  geo: { lat: number; lng: number } | null;
  status: StationStatus;
  created_at: string;
};

export type BaseStationInput = {
  code: string;
  name: string;
  node_type: NodeType;
  mgmt_ip?: string | null;
  mgmt_port?: number | null;
  vendor?: string;
  model?: string;
  config?: Record<string, unknown>;
  position?: { x: number; y: number };
  geo?: { lat: number; lng: number } | null;
  status?: StationStatus;
};

export type TopologyLink = {
  id: string;
  source: string;
  target: string;
  bandwidth: string;
  latency_ms: number | null;
  status: string;
};

export type TopologyLinkInput = {
  source: string;
  target: string;
  bandwidth?: string;
  latency_ms?: number | null;
  status?: string;
};

export type Topology = {
  stations: BaseStation[];
  links: TopologyLink[];
};

export type SiteCamera = {
  id: string;
  site: string;
  name: string;
  location: { lat: number; lng: number } | null;
  rtsp_url: string;
  stream_url: string;
  hls_url: string | null;
  resolution: string;
  fps: number;
  status: "online" | "offline";
  created_at: string;
};

export type SiteCameraInput = {
  name: string;
  location?: { lat: number; lng: number } | null;
  rtsp_url?: string;
  stream_url?: string;
  resolution?: string;
  fps?: number;
};
