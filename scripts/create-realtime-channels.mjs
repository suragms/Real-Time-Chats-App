#!/usr/bin/env node
/**
 * Create InsForge realtime channels required by this app:
 *   - chat:main
 *   - presence:main
 *   - chat:dm:%
 *
 * Requires: INSFORGE_API_KEY and NEXT_PUBLIC_INSFORGE_BASE_URL in .env.local
 * Get API key: InsForge Dashboard → Settings → API Key (or get-api-key MCP tool)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  try {
    const raw = readFileSync(resolve(root, ".env.local"), "utf8");
    const env = {};
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const baseUrl = (env.NEXT_PUBLIC_INSFORGE_BASE_URL || "").replace(/\/$/, "");
const apiKey = env.INSFORGE_API_KEY;

if (!baseUrl || !apiKey) {
  console.error(
    "Missing env. In .env.local set:\n  NEXT_PUBLIC_INSFORGE_BASE_URL=https://your-app.region.insforge.app\n  INSFORGE_API_KEY=your-admin-api-key"
  );
  console.error(
    "Get API key: InsForge Dashboard → Settings → API Key (or use get-api-key MCP tool)."
  );
  process.exit(1);
}

const channels = [
  { pattern: "chat:main", description: "Main room chat" },
  { pattern: "presence:main", description: "Presence (who is online)" },
  { pattern: "chat:dm:%", description: "1:1 DM channels" },
];

const url = `${baseUrl}/api/realtime/channels`;
const headers = {
  "Content-Type": "application/json",
  "X-API-Key": apiKey,
};

for (const ch of channels) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ pattern: ch.pattern, description: ch.description, enabled: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log(`Created channel: ${ch.pattern} (${data.id || "ok"})`);
    } else {
      if (data.message?.toLowerCase().includes("already") || res.status === 409) {
        console.log(`Channel already exists: ${ch.pattern}`);
      } else {
        console.error(`Failed ${ch.pattern}:`, res.status, data.message || data.error || JSON.stringify(data));
      }
    }
  } catch (err) {
    console.error(`Error creating ${ch.pattern}:`, err.message);
  }
}

console.log("Done. Refresh Realtime → Channels in the InsForge dashboard to confirm.");
