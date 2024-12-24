import { fetchCameraList } from "@/lib/api/camera/fetch";

export async function GET() {
  const cameras = await fetchCameraList();

  return Response.json({
    message: "Cameras fetched !",
    formulas: cameras,
  }, {
    status: 200,
  });
}
