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
        throw new Error('No formula provided');
      }

      let existingFormulas = [];
      try {
        const fileContent = await fs.readFile(formulasPath, 'utf8');
        existingFormulas = JSON.parse(fileContent);
      } catch (err) {
        existingFormulas = [];
      }

      existingFormulas.push({ id: Date.now(), formula: newFormula });

      await fs.writeFile(formulasPath, JSON.stringify(existingFormulas, null, 2));

      return { success: true };

    case 'DELETE':
      // Remove a formula
      const deleteBody = await readBody(event);
      const formulaId = deleteBody.id;

      if (!formulaId) {
        throw new Error('No formula ID provided');
      }

      let formulasToDeleteFrom = [];
      try {
        const fileContent = await fs.readFile(formulasPath, 'utf8');
        formulasToDeleteFrom = JSON.parse(fileContent);
      } catch (err) {
        formulasToDeleteFrom = [];
      }

      formulasToDeleteFrom = formulasToDeleteFrom.filter((f: { id: any; }) => f.id !== formulaId);

      await fs.writeFile(formulasPath, JSON.stringify(formulasToDeleteFrom, null, 2));

      return { success: true };

    default:
      throw new Error('Method not allowed');
  }
});
