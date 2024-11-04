// server/api/formulas/[id].ts
import { promises as fs } from 'fs';
import { resolve } from 'path';

const formulasPath = resolve('./data/json/formulas.json');

export default defineEventHandler(async (event) => {
  const method = event.req.method;
  const { id } = event.context.params as unknown as { id: string };

  let formulas = [];
  try {
    const fileContent = await fs.readFile(formulasPath, 'utf8');
    formulas = JSON.parse(fileContent);
  } catch (err) {
    formulas = [];
  }

  const formulaId = parseInt(id);

  switch (method) {
    case 'GET':
      // Retrieve a specific formula
      const formula = formulas.find((f: { id: number; }) => f.id === formulaId);
      if (formula) {
        return formula;
      } else {
        throw createError({ statusCode: 404, message: 'Formula not found' });
      }

    case 'PUT':
      // Update a formula
      const body = await readBody(event);
      const updatedFormula = body.formula;

      if (!updatedFormula) {
        throw createError({ statusCode: 400, message: 'No formula provided' });
      }

      const index = formulas.findIndex((f: { id: number; }) => f.id === formulaId);
      if (index !== -1) {
        formulas[index].formula = updatedFormula;
        await fs.writeFile(formulasPath, JSON.stringify(formulas, null, 2));
        return { success: true, formula: formulas[index] };
      } else {
        throw createError({ statusCode: 404, message: 'Formula not found' });
      }

    case 'DELETE':
      // Delete a formula
      const newFormulas = formulas.filter((f: { id: number; }) => f.id !== formulaId);

      if (newFormulas.length !== formulas.length) {
        await fs.writeFile(formulasPath, JSON.stringify(newFormulas, null, 2));
        return { success: true };
      } else {
        throw createError({ statusCode: 404, message: 'Formula not found' });
      }

    default:
      throw createError({ statusCode: 405, message: 'Method not allowed' });
  }
});
