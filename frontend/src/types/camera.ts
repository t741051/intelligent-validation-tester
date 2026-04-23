export type Camera = {
  id: string;
  scenario: string;
  name: string;
  location: { lat: number; lng: number };
  rtsp_url: string;
  stream_url: string;
  resolution: string;
  fps: number;
  status: "online" | "offline";
};
