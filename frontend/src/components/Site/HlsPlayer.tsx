"use client";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

// MediaMTX with sourceOnDemand only starts pulling when the first playlist
// request comes in, so the manifest is 404 for the first few seconds.
// These retry knobs let hls.js wait it out instead of bailing immediately.
const RETRY_CONFIG = {
  manifestLoadingMaxRetry: 10,
  manifestLoadingRetryDelay: 1000,
  manifestLoadingMaxRetryTimeout: 20_000,
  levelLoadingMaxRetry: 10,
  levelLoadingRetryDelay: 1000,
  fragLoadingMaxRetry: 6,
  fragLoadingRetryDelay: 1000,
};

export function HlsPlayer({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    setStatus("loading");

    const onReady = () => setStatus("ready");
    video.addEventListener("loadeddata", onReady);

    // Safari: native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      void video.play().catch(() => { /* ignore autoplay block */ });
      return () => video.removeEventListener("loadeddata", onReady);
    }

    if (Hls.isSupported()) {
      const hls = new Hls(RETRY_CONFIG);
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => { /* ignore autoplay block */ });
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setStatus("error");
      });
      return () => {
        hls.destroy();
        video.removeEventListener("loadeddata", onReady);
      };
    }
  }, [src]);

  return (
    <div className="relative">
      <video
        ref={ref}
        controls
        autoPlay
        muted
        playsInline
        poster={poster}
        className="w-full aspect-video bg-black rounded-item"
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-item text-white text-sm pointer-events-none">
          連線中…(首次播放 MediaMTX 需幾秒暖機)
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-item text-danger text-sm">
          無法連上串流,請檢查 RTSP 來源或 MediaMTX 設定
        </div>
      )}
    </div>
  );
}
