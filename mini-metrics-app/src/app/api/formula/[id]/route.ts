import { RequestFormula } from "@/lib/api/types";
import prisma from "@/lib/db/client";

export async function GET(
  request: Request,
  { params }: { params: { id: number } },
) {
  const formula = await prisma.formula.findUnique({
    where: {
      id: params.id
    }
  });

  return Response.json({
    message: "Formula found !",
    formula: formula,
  }, {
    status: 200,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: number } },
) {
  const formula = await request.json() as RequestFormula;
  const modifiedFormula = await prisma.formula.update({
    where: {
      id: params.id,
    },
    data: {
      formula: formula.formula
    }
  });

  return Response.json({
    message: "Formula successfully modified !",
    formula: modifiedFormula,
  }, {
    status: 200,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } },
) {
  const deletedFormula = await prisma.formula.delete({
    where: {
      id: params.id,
    },
  });

  return Response.json({
    message: "Formula erased !",
    formula: deletedFormula,
  }, {
    status: 200,
  });
}
