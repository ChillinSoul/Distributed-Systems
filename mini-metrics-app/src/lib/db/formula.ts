import {
  Prisma,
  Formula as FormulaDB
} from "@prisma/client";

export type Formula = FormulaDB;

export const formulaWithResults = Prisma.validator<Prisma.FormulaDefaultArgs>()({
  include: {
    results: true
  }
});
export type FormulaWithResults = Prisma.FormulaGetPayload<typeof formulaWithResults>;
