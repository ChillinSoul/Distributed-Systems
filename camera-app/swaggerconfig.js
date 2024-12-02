import path from 'path';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Documentation of my API',
    },
  },
  apis: [path.join(process.cwd(), 'src/app/api/**/*.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

const yamlSpec = YAML.stringify(swaggerSpec, 4);

// Définir le chemin où le fichier YAML sera sauvegardé
const outputPath = path.resolve(process.cwd(), 'public/docs/openapi.yaml');

// Sauvegarder la spécification OpenAPI en YAML
fs.writeFileSync(outputPath, yamlSpec, 'utf8');

console.log('OpenAPI YAML file generated at', outputPath);

export default swaggerSpec;
