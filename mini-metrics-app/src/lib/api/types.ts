import { Formula, Result } from "@prisma/client";

export type RequestFormula = Omit<Formula, "id" | "authorId" | "createdAt">;
export type RequestResult = Omit<Result, "id" | "formulaId" | "createdAt">;
