import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../data");
const dataFile = path.join(dataDir, "enquiries.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try { await fs.access(dataFile); }
  catch { await fs.writeFile(dataFile, "[]", "utf8"); }
}

export async function getEnquiries() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  try { return JSON.parse(raw); } catch { return []; }
}

export async function addEnquiry(input) {
  const enquiries = await getEnquiries();
  const enquiry = { id: randomUUID(), ...input, createdAt: new Date().toISOString() };
  enquiries.unshift(enquiry);
  await fs.writeFile(dataFile, JSON.stringify(enquiries, null, 2), "utf8");
  return enquiry;
}
