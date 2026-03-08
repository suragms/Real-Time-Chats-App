import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@insforge/sdk";

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
    } catch (e) {
        return {};
    }
}

async function checkDb() {
    const env = loadEnv();
    const baseUrl = env.NEXT_PUBLIC_INSFORGE_BASE_URL;
    const anonKey = env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

    if (!baseUrl || !anonKey) {
        console.error("Missing credentials in .env.local");
        process.exit(1);
    }

    console.log("Connecting to InsForge at:", baseUrl);
    const client = createClient({ baseUrl, anonKey });

    try {
        console.log("Checking profiles table...");
        const { data: profiles, error: pErr } = await client.database
            .from("profiles")
            .select("*")
            .limit(1);

        if (pErr) {
            console.error("Profiles error:", pErr);
        } else {
            console.log("Profiles table exists!");
        }

        console.log("Checking messages table...");
        const { data: messages, error: mErr } = await client.database
            .from("messages")
            .select("*")
            .limit(1);

        if (mErr) {
            console.error("Messages error:", mErr);
        } else {
            console.log("Messages table exists!");
        }

    } catch (err) {
        console.error("Connection error:", err);
    }
}

checkDb();
