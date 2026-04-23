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

import { apiClient } from "../api/client";

export const sitesService = {
  async list(params: { region?: Region } = {}): Promise<Paginated<Site>> {
    const { data } = await apiClient.get("/sites/", { params });
    return data;
  },
  async create(input: SiteInput): Promise<Site> {
    const { data } = await apiClient.post("/sites/", input);
    return data;
  },
  async update(id: string, input: Partial<SiteInput>): Promise<Site> {
    const { data } = await apiClient.patch(`/sites/${id}/`, input);
    return data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/sites/${id}/`);
  },
  async listStations(siteId: string): Promise<BaseStation[]> {
    const { data } = await apiClient.get(`/sites/${siteId}/stations/`);
    return data;
  },
  async createStation(siteId: string, input: BaseStationInput): Promise<BaseStation> {
    const { data } = await apiClient.post(`/sites/${siteId}/stations/`, input);
    return data;
  },
  async updateStation(
    siteId: string,
    code: string,
    input: Partial<BaseStationInput>,
  ): Promise<BaseStation> {
    const { data } = await apiClient.patch(
      `/sites/${siteId}/stations/${code}/`,
      input,
    );
    return data;
  },
  async deleteStation(siteId: string, code: string): Promise<void> {
    await apiClient.delete(`/sites/${siteId}/stations/${code}/`);
  },
  async getTopology(siteId: string): Promise<Topology> {
    const { data } = await apiClient.get(`/sites/${siteId}/topology/`);
    return data;
  },
  async updateTopology(siteId: string, links: TopologyLinkInput[]): Promise<TopologyLink[]> {
    const { data } = await apiClient.patch(`/sites/${siteId}/topology/`, { links });
    return data;
  },
  async listCameras(siteId: string): Promise<SiteCamera[]> {
    const { data } = await apiClient.get(`/sites/${siteId}/cameras/`);
    return data;
  },
  async createCamera(siteId: string, input: SiteCameraInput): Promise<SiteCamera> {
    const { data } = await apiClient.post(`/sites/${siteId}/cameras/`, input);
    return data;
  },
  async updateCamera(
    siteId: string,
    cameraId: string,
    input: Partial<SiteCameraInput>,
  ): Promise<SiteCamera> {
    const { data } = await apiClient.patch(
      `/sites/${siteId}/cameras/${cameraId}/`,
      input,
    );
    return data;
  },
  async deleteCamera(siteId: string, cameraId: string): Promise<void> {
    await apiClient.delete(`/sites/${siteId}/cameras/${cameraId}/`);
  },
};
