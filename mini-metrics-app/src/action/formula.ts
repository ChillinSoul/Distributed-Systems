"use server"

import { createFormulaDTO, getFormulaListDTO, getFormulaResultsDTO, type NewFormula } from "@/lib/dto/formula_dto";

export async function createFormula(formula: NewFormula) {
  const newFormula = createFormulaDTO(formula);
  return newFormula;
}

export async function getFormulaList() {
  const formulaList = getFormulaListDTO();
  return formulaList;
}

export async function getFormulaResults(formulaId: number) {
  const formulaWithResults = getFormulaResultsDTO(formulaId);
  return formulaWithResults;
}
