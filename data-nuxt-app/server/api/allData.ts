import { promises as fs } from 'fs';
import { resolve } from 'path';

export default defineEventHandler(async () => {
  const anprDataPath = resolve('./data/json/anprData.json');
  const mapDataPath = resolve('./data/json/mapData.json');

  let anprData = [];
  let mapData = [];

  try {
    const anprFileContent = await fs.readFile(anprDataPath, 'utf8');
    anprData = JSON.parse(anprFileContent);
  } catch (err) {
    anprData = [];
  }

  try {
    const mapFileContent = await fs.readFile(mapDataPath, 'utf8');
    mapData = JSON.parse(mapFileContent);
  } catch (err) {
    mapData = [];
  }

  return {
    anpr: anprData,
    map: mapData,
  };
});
