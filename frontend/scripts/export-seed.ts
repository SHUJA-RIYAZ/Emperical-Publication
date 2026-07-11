/**
 * Exports the frontend mock data to JSON so the backend seeder
 * (backend/seed.py) can load identical content into PostgreSQL.
 *
 * Run: npx tsx scripts/export-seed.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { authors } from "../src/data/authors";
import { blogs } from "../src/data/blogs";
import { books } from "../src/data/books";
import { faqs } from "../src/data/faq";
import { journals } from "../src/data/journals";
import { services } from "../src/data/services";
import { defaultSettings } from "../src/data/settings";
import { testimonials } from "../src/data/testimonials";

const outDir = join(import.meta.dirname, "..", "..", "backend", "seed");
mkdirSync(outDir, { recursive: true });

const datasets = { authors, books, blogs, journals, services, testimonials, faqs };

for (const [name, data] of Object.entries(datasets)) {
  writeFileSync(join(outDir, `${name}.json`), JSON.stringify(data, null, 2));
  console.log(`Wrote ${data.length} records to backend/seed/${name}.json`);
}

writeFileSync(join(outDir, "settings.json"), JSON.stringify(defaultSettings, null, 2));
console.log("Wrote default site settings to backend/seed/settings.json");
