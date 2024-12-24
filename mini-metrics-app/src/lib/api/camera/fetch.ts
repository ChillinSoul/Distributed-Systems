import "server-only";
import { ApiCamera, ApiVideo } from "./types";

export async function fetchCameraList() {
  const response = await fetch(process.env.CAMERA_URL! + "/api/cameras", { cache: "no-store" });
  const results = await response.json() as ApiCamera[];
  return results;
}

export async function fetchAllVideos() {
  const response = await fetch(process.env.CAMERA_URL! + "/api/videos", { cache: "no-store" });
  const results = await response.json() as ApiVideo[];
  return results;
}

export async function fetchCameraVideos(cameraId: number) {
  const response = await fetch(process.env.CAMERA_URL! + "/api/videos/" + cameraId.toString(), { cache: "no-store" });
  const results = await response.json() as ApiVideo[];
  return results;
}
