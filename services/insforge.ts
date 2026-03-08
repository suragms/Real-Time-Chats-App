import { createClient } from "@insforge/sdk";

const baseUrl = (process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ?? "").trim();
const anonKey = (process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ?? "").trim();

export const isInsForgeConfigured = baseUrl.length > 0;

export const insforge = createClient({
    baseUrl: baseUrl || "https://placeholder.insforge.app",
    anonKey: anonKey || undefined,
});
