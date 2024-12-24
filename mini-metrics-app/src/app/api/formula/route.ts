import { RequestFormula } from "@/lib/api/types";
import prisma from "@/lib/db/client";
import { getUserId } from "@/lib/session";

export async function POST(
  request: Request,
) {
  const userId = await getUserId();
  if (!userId) return Response.json({
    message: "You must log in to your account to add formulas",
  }, {
    status: 403,
  });

  const formula = await request.json() as RequestFormula;
  const createdFormula = await prisma.formula.create({
    data: {
      formula: formula.formula,
      beginAt: formula.beginAt,
      endAt: formula.endAt,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return Response.json({
    message: "Formula successfully created !",
    formula: createdFormula,
  }, {
    status: 200,
  });
}
