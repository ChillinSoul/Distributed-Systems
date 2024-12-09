import { PrismaClient } from "@prisma/client"



/**
 * @swagger
 * /api/videos/{cameranumber}:
 *   get:
 *     summary: Retrieve videos by camera number
 *     description: Fetch all video records associated with the specified camera number.
 *     parameters:
 *       - name: cameranumber
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "The unique identifier of the camera whose videos are to be retrieved."
 *     responses:
 *       200:
 *         description: "A list of video records for the specified camera number."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: "The unique ID of the video."
 *                       cameranumber:
 *                         type: string
 *                         description: "The camera number associated with the video."
 *                       numberplate:
 *                         type: string
 *                         description: "The number plate recorded in the video."
 *                       typevehicule:
 *                         type: string
 *                         description: "The type of vehicle captured in the video."
 *                       createat:
 *                         type: string
 *                         format: date-time
 *                         description: "The creation timestamp of the video."
 *       404:
 *         description: No videos found for the given camera number.
 *       500:
 *         description: Internal server error.
 */

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