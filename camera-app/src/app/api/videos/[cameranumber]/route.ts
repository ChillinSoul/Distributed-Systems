import { PrismaClient } from "@prisma/client"


export async function GET(
  req: Request,
  { params }: { params: { cameranumber : string } }
) {
  const prisma = new PrismaClient()
  const data = await prisma.video.findMany({
    where: {
    cameranumber: params.cameranumber,
    },
})
  return Response.json({ data }) 
}