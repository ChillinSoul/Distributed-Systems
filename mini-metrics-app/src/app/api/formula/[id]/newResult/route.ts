import type { RequestResult } from "@/lib/api/types";
import prisma from "@/lib/db/client";
import { ResultType } from "@prisma/client";

export async function PUT(
  request: Request,
  { params }: { params: { id: number } },
) {
  const result = await request.json() as RequestResult;
  const modifiedFormula = await prisma.formula.update({
    where: {
      id: params.id,
    },
    data: {
      results: {
        create: {
          result: JSON.stringify(result.result),
          type: ResultType.number,
        },
      },
    },
    include: {
      results: true,
    }
  });

  return Response.json({
    message: "Result successfully added !",
    formula: modifiedFormula,
  }, {
    status: 200,
  });
}
