import { RequestFormula } from "@/lib/api/types";
import prisma from "@/lib/db/client";

export async function POST(
  request: Request,
) {
  const formula = await request.json() as RequestFormula;
  const createdFormula = await prisma.formula.create({
    data: {
      formula: formula.formula
    }
  });

  return Response.json({
    message: "Formula successfully created !",
    formula: createdFormula,
  }, {
    status: 200,
  });
}
