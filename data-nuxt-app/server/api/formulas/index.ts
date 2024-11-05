// server/api/formulas/index.ts
import { promises as fs } from 'fs';
import { resolve } from 'path';

const formulasPath = resolve('./data/json/formulas.json');

export default defineEventHandler(async (event) => {
  const method = event.req.method;

  switch (method) {
    case 'GET':
      // Return list of formulas
      let formulas = [];
      try {
        const fileContent = await fs.readFile(formulasPath, 'utf8');
        formulas = JSON.parse(fileContent);
      } catch (err) {
        formulas = [];
      }
      return formulas;

    case 'POST':
      // Add a new formula
      const body = await readBody(event);
      const newFormula = body.formula;

      if (!newFormula) {
        throw createError({ statusCode: 400, message: 'No formula provided' });
      }

      let existingFormulas = [];
      try {
        const fileContent = await fs.readFile(formulasPath, 'utf8');
        existingFormulas = JSON.parse(fileContent);
      } catch (err) {
        existingFormulas = [];
      }

      const newFormulaObj = { id: Date.now(), formula: newFormula };

      existingFormulas.push(newFormulaObj);

      await fs.writeFile(formulasPath, JSON.stringify(existingFormulas, null, 2));

      return { success: true, formula: newFormulaObj };

    default:
      throw createError({ statusCode: 405, message: 'Method not allowed' });
  }
});
