import type { Paginated, Region } from "@/types/common";
import type {
  BaseStation,
  BaseStationInput,
  Site,
  SiteCamera,
  SiteCameraInput,
  SiteInput,
  Topology,
  TopologyLink,
  TopologyLinkInput,
} from "@/types/site";

let sites: Site[] = [
  {
    id: "mock-site-1",
    name: "新竹科學園區",
    region: "domestic",
    environment: "outdoor",
    address: "新竹市東區力行路 2 號",
    location: { lat: 24.784, lng: 120.994 },
    floor_plan_url: "",
    created_at: "2026-03-01T08:00:00+08:00",
  },
  {
    id: "mock-site-2",
    name: "工研院 R&D Lab",
    region: "domestic",
    environment: "indoor",
    address: "新竹縣竹東鎮中興路四段 195 號",
    location: null,
    floor_plan_url: "",
    created_at: "2026-03-05T10:00:00+08:00",
  },
  {
    id: "mock-site-3",
    name: "Tokyo NTT Docomo",
    region: "international",
    environment: "outdoor",
    address: "Minato-ku, Tokyo",
    location: { lat: 35.658, lng: 139.751 },
    floor_plan_url: "",
    created_at: "2026-03-10T09:00:00+08:00",
  },
];

const stationsBySite: Record<string, BaseStation[]> = {
  "mock-site-1": [
    {
      id: "ms1-gnb1", site: "mock-site-1", code: "gnb-1", name: "gNB 北",
      node_type: "gnb", mgmt_ip: null, mgmt_port: null, vendor: "", model: "", config: {},
      position: { x: 20, y: 30 }, geo: null,
      status: "normal", created_at: "2026-03-01T08:00:00+08:00",
    },
    {
      id: "ms1-smo1", site: "mock-site-1", code: "smo-1", name: "SMO 主控",
      node_type: "smo", mgmt_ip: null, mgmt_port: null, vendor: "", model: "", config: {},
      position: { x: 70, y: 30 }, geo: null,
      status: "normal", created_at: "2026-03-01T08:00:00+08:00",
    },
    {
      id: "ms1-ric1", site: "mock-site-1", code: "ric-1", name: "Near-RT RIC",
      node_type: "ric", mgmt_ip: null, mgmt_port: null, vendor: "", model: "", config: {},
      position: { x: 70, y: 70 }, geo: null,
      status: "warning", created_at: "2026-03-01T08:00:00+08:00",
    },
  ],
};

const camerasBySite: Record<string, SiteCamera[]> = {};

const linksBySite: Record<string, TopologyLink[]> = {
  "mock-site-1": [
    { id: "l1", source: "ms1-gnb1", target: "ms1-smo1", bandwidth: "10Gbps", latency_ms: 1.2, status: "normal" },
    { id: "l2", source: "ms1-smo1", target: "ms1-ric1", bandwidth: "1Gbps", latency_ms: 0.5, status: "normal" },
  ],
};

function delay(ms = 150) {
  return new Promise((r) => setTimeout(r, ms));
}

export const mockSitesService = {
  async list({ region }: { region?: Region } = {}): Promise<Paginated<Site>> {
    await delay();
    const items = region ? sites.filter((s) => s.region === region) : sites;
    return { items, total: items.length, page: 1, limit: 20 };
  },
  async create(input: SiteInput): Promise<Site> {
    await delay();
    const s: Site = {
      ...input,
      id: `mock-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    sites = [s, ...sites];
    return s;
  },
  async update(id: string, input: Partial<SiteInput>): Promise<Site> {
    await delay();
    sites = sites.map((s) => (s.id === id ? { ...s, ...input } as Site : s));
    const found = sites.find((s) => s.id === id);
    if (!found) throw new Error("Site not found");
    return found;
  },
  async remove(id: string): Promise<void> {
    await delay();
    sites = sites.filter((s) => s.id !== id);
    delete stationsBySite[id];
    delete linksBySite[id];
  },
  async listStations(siteId: string): Promise<BaseStation[]> {
    await delay();
    return stationsBySite[siteId] ?? [];
  },
  async createStation(siteId: string, input: BaseStationInput): Promise<BaseStation> {
    await delay();
    const station: BaseStation = {
      id: `${siteId}-${input.code}-${Date.now()}`,
      site: siteId,
      code: input.code,
      name: input.name,
      node_type: input.node_type,
      mgmt_ip: input.mgmt_ip ?? null,
      mgmt_port: input.mgmt_port ?? null,
      vendor: input.vendor ?? "",
      model: input.model ?? "",
      config: input.config ?? {},
      position: input.position ?? { x: 50, y: 50 },
      geo: input.geo ?? null,
      status: input.status ?? "normal",
      created_at: new Date().toISOString(),
    };
    stationsBySite[siteId] = [...(stationsBySite[siteId] ?? []), station];
    return station;
  },
  async updateStation(
    siteId: string,
    code: string,
    input: Partial<BaseStationInput>,
  ): Promise<BaseStation> {
    await delay();
    const list = stationsBySite[siteId] ?? [];
    const next = list.map((s) =>
      s.code === code ? ({ ...s, ...input } as BaseStation) : s,
    );
    stationsBySite[siteId] = next;
    const found = next.find((s) => s.code === code);
    if (!found) throw new Error("Station not found");
    return found;
  },
  async deleteStation(siteId: string, code: string): Promise<void> {
    await delay();
    const list = stationsBySite[siteId] ?? [];
    const removed = list.find((s) => s.code === code);
    stationsBySite[siteId] = list.filter((s) => s.code !== code);
    if (removed) {
      linksBySite[siteId] = (linksBySite[siteId] ?? []).filter(
        (l) => l.source !== removed.id && l.target !== removed.id,
      );
    }
  },
  async getTopology(siteId: string): Promise<Topology> {
    await delay();
    return {
      stations: stationsBySite[siteId] ?? [],
      links: linksBySite[siteId] ?? [],
    };
  },
  async updateTopology(siteId: string, links: TopologyLinkInput[]): Promise<TopologyLink[]> {
    await delay();
    const replaced = links.map((l, idx) => ({
      id: `mock-link-${Date.now()}-${idx}`,
      source: l.source,
      target: l.target,
      bandwidth: l.bandwidth ?? "",
      latency_ms: l.latency_ms ?? null,
      status: l.status ?? "normal",
    }));
    linksBySite[siteId] = replaced;
    return replaced;
  },
  async listCameras(siteId: string): Promise<SiteCamera[]> {
    await delay();
    return camerasBySite[siteId] ?? [];
  },
  async createCamera(siteId: string, input: SiteCameraInput): Promise<SiteCamera> {
    await delay();
    const cam: SiteCamera = {
      id: `${siteId}-cam-${Date.now()}`,
      site: siteId,
      name: input.name,
      location: input.location ?? null,
      rtsp_url: input.rtsp_url ?? "",
      stream_url: input.stream_url ?? "",
      hls_url: input.rtsp_url
        ? `/hls/cam-${siteId}-${Date.now()}/index.m3u8`
        : input.stream_url ?? null,
      resolution: input.resolution ?? "1920x1080",
      fps: input.fps ?? 30,
      status: "offline",
      created_at: new Date().toISOString(),
    };
    camerasBySite[siteId] = [...(camerasBySite[siteId] ?? []), cam];
    return cam;
  },
  async updateCamera(
    siteId: string,
    cameraId: string,
    input: Partial<SiteCameraInput>,
  ): Promise<SiteCamera> {
    await delay();
    const list = camerasBySite[siteId] ?? [];
    const next = list.map((c) => {
      if (c.id !== cameraId) return c;
      const merged: SiteCamera = {
        ...c,
        ...input,
        location: input.location !== undefined ? input.location : c.location,
      } as SiteCamera;
      merged.hls_url = merged.rtsp_url
        ? `/hls/cam-${merged.id}/index.m3u8`
        : merged.stream_url || null;
      return merged;
    });
    camerasBySite[siteId] = next;
    const found = next.find((c) => c.id === cameraId);
    if (!found) throw new Error("Camera not found");
    return found;
  },
  async deleteCamera(siteId: string, cameraId: string): Promise<void> {
    await delay();
    camerasBySite[siteId] = (camerasBySite[siteId] ?? []).filter((c) => c.id !== cameraId);
  },
};
