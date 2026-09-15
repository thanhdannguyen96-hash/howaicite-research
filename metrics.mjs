/** HowAICite research toolkit v1.0.0. Copyright 2026 HowAICite. MIT licensed. */
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function summarizeStudy(rows, panel) {
  if (!Array.isArray(rows)) throw Error("Observations must be a JSON array.");
  if (!panel || !Array.isArray(panel.prompts) || !Array.isArray(panel.surfaces) || !Number.isInteger(panel.replicates) || panel.replicates < 1) throw Error("Invalid study panel.");
  const prompts = new Map(panel.prompts.map(p => [p.id, p]));
  if (prompts.size !== panel.prompts.length || new Set(panel.surfaces).size !== panel.surfaces.length) throw Error("Panel IDs and surfaces must be unique.");
  const runs = new Set();
  const cells = new Set();
  const grouped = new Map();
  for (const row of rows) {
    if (!row || typeof row !== "object") throw Error("Invalid observation.");
    for (const field of ["id", "wave", "promptId", "surface", "countryCode", "language", "observedAt", "collectionMethod", "model", "locationProvenance"]) {
      if (typeof row[field] !== "string" || !row[field].trim()) throw Error(`Missing ${field}.`);
    }
    if (runs.has(row.id)) throw Error(`Duplicate observation ID: ${row.id}`);
    runs.add(row.id);
    if (!prompts.has(row.promptId) || !panel.surfaces.includes(row.surface)) throw Error("Observation outside the frozen panel.");
    if (row.countryCode !== panel.countryCode || row.language !== panel.language) throw Error("Market or language differs from the panel; use a separate panel.");
    if (!Number.isInteger(row.replicate) || row.replicate < 1 || row.replicate > panel.replicates) throw Error("Invalid replicate.");
    if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(row.observedAt) || !Number.isFinite(Date.parse(row.observedAt))) throw Error("Timestamp must include a timezone.");
    if (!["consumer-ui", "api"].includes(row.collectionMethod)) throw Error("Unknown collection method.");
    if (row.collectionMethod === "api" && !row.surface.includes("API")) throw Error("API observations must use a separately named API surface and panel.");
    if (!["complete", "failed", "no-answer"].includes(row.status)) throw Error("Unknown collection status.");
    const cell = JSON.stringify([row.wave,row.promptId,row.surface,row.replicate]);
    if (cells.has(cell)) throw Error("Duplicate planned cell; keep retries separate from the accepted observation.");
    cells.add(cell);
    if (row.status === "complete" && (typeof row.answer !== "string" || !row.answer.trim())) throw Error("Completed observations need the original answer.");
    if (!Array.isArray(row.sourceUrls)) throw Error("sourceUrls must be an array.");
    for (const source of row.sourceUrls) { const url = new URL(source); if (!["https:","http:"].includes(url.protocol)) throw Error("Invalid citation protocol."); }
    const labels = [row.mentioned,row.recommended,row.cited];
    if (!labels.every(value => value === null || typeof value === "boolean")) throw Error("Labels must be boolean or null (unreviewed).");
    if (row.status !== "complete" && labels.some(value => value !== null)) throw Error("Failed and no-answer attempts must not be labeled as brand absence.");
    const reviewed = row.status === "complete" && labels.every(value => typeof value === "boolean");
    if (reviewed && (typeof row.reviewer !== "string" || !row.reviewer.trim())) throw Error("Reviewed observations need a reviewer identifier.");
    if (row.cited === true && !row.sourceUrls.some(source => { const host = new URL(source).hostname.toLowerCase(); return host === panel.targetDomain || host.endsWith(`.${panel.targetDomain}`); })) throw Error("Own-domain citation label requires an own-domain source URL.");
    if (row.recommended === true && (typeof row.recommendationQuote !== "string" || !row.recommendationQuote.trim() || !row.answer.includes(row.recommendationQuote))) throw Error("Recommendations need an exact supporting excerpt from the answer.");
    const prompt = prompts.get(row.promptId);
    const key = JSON.stringify([row.wave,row.surface,row.collectionMethod,row.model,row.locationProvenance,prompt.branded]);
    if (!grouped.has(key)) grouped.set(key,{wave:row.wave,surface:row.surface,collectionMethod:row.collectionMethod,model:row.model,locationProvenance:row.locationProvenance,branded:prompt.branded,attempted:0,completed:0,failed:0,noAnswer:0,reviewed:0,mentioned:0,recommended:0,cited:0,recommendedWithoutCitation:0,citedWithoutRecommendation:0,both:0});
    const group=grouped.get(key); group.attempted++;
    if (row.status === "failed") group.failed++;
    if (row.status === "no-answer") group.noAnswer++;
    if (row.status === "complete") group.completed++;
    if (reviewed) {
      group.reviewed++; group.mentioned+=Number(row.mentioned); group.recommended+=Number(row.recommended); group.cited+=Number(row.cited);
      group.recommendedWithoutCitation+=Number(row.recommended && !row.cited);
      group.citedWithoutRecommendation+=Number(row.cited && !row.recommended);
      group.both+=Number(row.recommended && row.cited);
    }
  }
  const plannedPerWave=panel.prompts.length*panel.surfaces.length*panel.replicates;
  return {version:"1.0.0",panelId:panel.id,status:rows.length ? "observed-sample" : "not-collected",plannedPerWave,observations:rows.length,
    waves:[...new Set(rows.map(row=>row.wave))].map(wave=>({wave,planned:plannedPerWave,attempted:rows.filter(row=>row.wave===wave).length,completed:rows.filter(row=>row.wave===wave&&row.status==="complete").length})),
    cohorts:[...grouped.values()].map(group=>({...group,unreviewed:group.completed-group.reviewed,mentionRate:group.reviewed ? group.mentioned/group.reviewed : null,recommendationRate:group.reviewed ? group.recommended/group.reviewed : null,citationRate:group.reviewed ? group.cited/group.reviewed : null})),
    limitations:["Sample rates, not population estimates or ranking probabilities.","Branded and unbranded prompts are separate cohorts.","API, consumer interfaces, models and location provenance are kept separate.","Source labels require human review; URL presence does not verify claim support.","Missing planned cells and failed/no-answer attempts are not negative brand observations."]};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [panelPath,observationsPath]=process.argv.slice(2);
    if (!panelPath || !observationsPath) throw Error("Usage: node metrics.mjs prompt-panel.json observations.json");
    const [panel,rows]=await Promise.all([readFile(panelPath,"utf8").then(JSON.parse),readFile(observationsPath,"utf8").then(JSON.parse)]);
    process.stdout.write(JSON.stringify(summarizeStudy(rows,panel),null,2)+"\n");
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode=1; }
}
