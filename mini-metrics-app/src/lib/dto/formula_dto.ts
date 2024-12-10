import "server-only";
import { getUser } from "../dal";
import prisma from "../db/client";
import type { Formula } from "@prisma/client";

export type NewFormula = {
	formula: string;
	// id: undefined;
	// authorId: undefined;
	// createdAt: undefined;
	beginAt: string | undefined;
	endAt: string | undefined;
	period: string | undefined;
}

export async function getFormulaListDTO() {
	const currentUser = await getUser();
	if (!currentUser) return null;

  const formulaList = await prisma.formula.findMany({
		where: {
			authorId: currentUser.id,
		},
	});

	return formulaList;
}

export async function getFormulaDTO(formulaId: number) {
	const currentUser = await getUser();
	if (!currentUser) return null;

	const formula = await prisma.formula.findUnique({
		where: {
			id: formulaId,
			authorId: currentUser.id,
		},
	});

	return formula;
}

export async function createFormulaDTO(formula: NewFormula) {
	const currentUser = await getUser();
	if (!currentUser) return null;

	const newFormula = await prisma.formula.create({
		data: {
			formula: formula.formula,
			author: {
				connect: {
					id: currentUser.id,
				},
			},
		},
	});

	return newFormula;
}

export async function updateFormulaDTO(formula: Formula) {
	const currentUser = await getUser();
	if (!currentUser) return null;
	
	const updatedFormula = await prisma.formula.update({
		data: formula,
		where: {
			id: formula.id,
			authorId: currentUser.id,
		},
	});

	return updatedFormula;
}

export async function deleteFormulaDTO(formulaId: number) {
	const currentUser = await getUser();
	if (!currentUser) return null;

	const deletedFormula = await prisma.formula.delete({
		where: {
			id: formulaId,
			authorId: currentUser.id,
		},
	});

	return deletedFormula;
}

export async function getFormulaResultsDTO(formulaId: number) {
	const currentUser = await getUser();
	if (!currentUser) return null;

	const formula = await prisma.formula.findUnique({
		where: {
			id: formulaId,
			authorId: currentUser.id,
		},
		include: {
			results: true,
		},
	});

	return formula;
}
