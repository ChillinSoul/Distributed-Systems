import { Formula, Result } from "@prisma/client";

export type RequestFormula = Pick<Formula, "formula"> & Partial<Omit<Formula, "id" | "formula" | "authorId" | "createdAt">>;
export type RequestResult = Omit<Result, "id" | "formulaId" | "createdAt">;
