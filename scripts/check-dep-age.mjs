#!/usr/bin/env node
/**
 * Checks the publish date of each dependency (and devDependency) listed in
 * package.json by querying the npm registry, then prints them sorted by age
 * (oldest first) so you can prioritise technical debt.
 *
 * Usage:  node scripts/check-dep-age.mjs [--dev] [--prod]
 *   --prod   only show dependencies
 *   --dev    only show devDependencies
 *   (no flag shows both)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

const args = process.argv.slice(2);
const onlyDev = args.includes("--dev");
const onlyProd = args.includes("--prod");

const entries = [
  ...(!onlyDev
    ? Object.entries(pkg.dependencies ?? {}).map(([name, ver]) => ({
        name,
        ver,
        kind: "prod",
      }))
    : []),
  ...(!onlyProd
    ? Object.entries(pkg.devDependencies ?? {}).map(([name, ver]) => ({
        name,
        ver,
        kind: "dev",
      }))
    : []),
];

async function fetchAge(name, version) {
  const clean = version.replace(/^[\^~]/, "");
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { published: null, latest: null, latestDate: null };
    const data = await res.json();
    const published = data?.time?.[clean] ?? null;
    const latest = data?.["dist-tags"]?.latest ?? null;
    const latestDate = latest ? (data?.time?.[latest] ?? null) : null;
    return { published, latest, latestDate };
  } catch {
    return { published: null, latest: null, latestDate: null };
  }
}

function ageInDays(dateStr) {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function formatAge(days) {
  if (days === null) return "unknown";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0 ? `${years}y ${months}mo` : `${years}y`;
}

function colorAge(days) {
  if (days === null) return "\x1b[90m"; // grey
  if (days > 365 * 2) return "\x1b[31m"; // red  (>2y)
  if (days > 365) return "\x1b[33m"; // yellow (>1y)
  return "\x1b[32m"; // green
}
const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

console.log(`\n${BOLD}Fetching publish dates for ${entries.length} packages…${RESET}\n`);

// Fetch concurrently (max 10 at a time to be polite to the registry)
const CONCURRENCY = 10;
const results = [];

for (let i = 0; i < entries.length; i += CONCURRENCY) {
  const batch = entries.slice(i, i + CONCURRENCY);
  const settled = await Promise.all(
    batch.map(async ({ name, ver, kind }) => {
      const { published, latest, latestDate } = await fetchAge(name, ver);
      return { name, ver, kind, published, latest, latestDate };
    })
  );
  results.push(...settled);
  process.stdout.write(`  ${Math.min(i + CONCURRENCY, entries.length)}/${entries.length} done\r`);
}

process.stdout.write("".padEnd(40) + "\r"); // clear progress line

// Sort: oldest installed version first, unknowns at bottom
results.sort((a, b) => {
  const da = ageInDays(a.published);
  const db = ageInDays(b.published);
  if (da === null && db === null) return 0;
  if (da === null) return 1;
  if (db === null) return -1;
  return db - da; // descending age (oldest first)
});

// Print table
const nameW = Math.max(...results.map((r) => r.name.length), 12);
const verW = Math.max(...results.map((r) => r.ver.length), 7);

console.log(
  `${BOLD}${"Package".padEnd(nameW)}  ${"Installed".padEnd(verW)}  ${"Published".padEnd(10)}  ${"Age".padEnd(8)}  ${"Latest".padEnd(verW)}  Latest published  Behind${RESET}`
);
console.log("─".repeat(nameW + verW * 2 + 52));

for (const { name, ver, kind, published, latest, latestDate } of results) {
  const days = ageInDays(published);
  const latestDays = ageInDays(latestDate);
  const color = colorAge(days);
  const installedIsLatest = ver.replace(/^[\^~]/, "") === latest;

  const publishedStr = published ? new Date(published).toISOString().slice(0, 10) : "unknown   ";
  const latestDateStr = latestDate ? new Date(latestDate).toISOString().slice(0, 10) : "unknown   ";
  const behindStr = installedIsLatest
    ? `${DIM}up-to-date${RESET}`
    : latest
      ? `${color}${formatAge(latestDays - (days ?? 0))} behind${RESET}`
      : "";

  const kindLabel = kind === "dev" ? `${DIM}[dev]${RESET}` : "     ";

  console.log(
    `${color}${name.padEnd(nameW)}${RESET}  ${ver.padEnd(verW)}  ${publishedStr}  ${color}${formatAge(days).padEnd(8)}${RESET}  ${(latest ?? "?").padEnd(verW)}  ${latestDateStr}  ${behindStr} ${kindLabel}`
  );
}

console.log();
console.log(`${BOLD}Legend:${RESET} \x1b[31mred >2y${RESET}  \x1b[33myellow >1y${RESET}  \x1b[32mgreen <1y${RESET}`);
console.log();
