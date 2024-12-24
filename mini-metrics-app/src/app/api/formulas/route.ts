import { getFormulaListDTO } from "@/lib/dto/formula_dto";

export async function GET() {
  const formulas = await getFormulaListDTO();

  return Response.json({
    message: "Formulas found !",
    formulas: formulas,
  }, {
    status: 200,
  });
}
