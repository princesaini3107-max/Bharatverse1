import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, name), 'utf8'));
}

// Static cultural content, loaded once at startup.
export const states = load('states.json');
export const cities = load('cities.json');
export const places = load('places.json');
export const food = load('food.json');
export const festivals = load('festivals.json');
export const articles = load('articles.json');
export const museum = load('museum.json');
export const artisans = load('artisans.json');
export const heritageAtRisk = load('heritageAtRisk.json');
export const quizzes = load('quizzes.json');
export const kb = load('kb.json');

export const byId = (arr, id) => arr.find((x) => x.id === id);
