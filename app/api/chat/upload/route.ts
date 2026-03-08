import { NextRequest, NextResponse } from "next/server";

const BUCKET = process.env.NEXT_PUBLIC_CHAT_ATTACHMENTS_BUCKET || "chat-attachments";
const BASE = (process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ?? "").trim();
if (!BASE || BASE.includes("placeholder")) {
  console.warn("[api/chat/upload] NEXT_PUBLIC_INSFORGE_BASE_URL is missing or placeholder");
}

export async function POST(request: NextRequest) {
  console.log("[api/chat/upload] POST received");
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    console.log("[api/chat/upload] 401: no token");
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }
  if (!BASE || BASE.includes("placeholder")) {
    return NextResponse.json(
      { error: "Server: InsForge base URL not configured" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = formData.get("file") as File | null;
  const pathParam = formData.get("path") as string | null;
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const path = (pathParam && pathParam.trim()) || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80)}`;

  try {
    const strategyRes = await fetch(`${BASE}/api/storage/buckets/${BUCKET}/upload-strategy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: path,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      }),
    });

    if (!strategyRes.ok) {
      const errText = await strategyRes.text();
      console.error("[api/chat/upload] strategy failed", strategyRes.status, errText);
      return NextResponse.json(
        { error: `Upload strategy failed: ${strategyRes.status} ${errText.slice(0, 200)}` },
        { status: strategyRes.status }
      );
    }

    const strategy = await strategyRes.json();
    if (strategy.method === "presigned" && strategy.uploadUrl) {
      const uploadForm = new FormData();
      if (strategy.fields) {
        for (const [k, v] of Object.entries(strategy.fields)) {
          uploadForm.append(k, v as string);
        }
      }
      uploadForm.append("file", file);
      const uploadRes = await fetch(strategy.uploadUrl, { method: "POST", body: uploadForm });
      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        console.error("[api/chat/upload] presigned upload failed", uploadRes.status, errText);
        return NextResponse.json({ error: `Upload failed: ${uploadRes.status}` }, { status: uploadRes.status });
      }
    } else if (strategy.method === "direct") {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      const objectPath = encodeURIComponent(path);
      const putRes = await fetch(`${BASE}/api/storage/buckets/${BUCKET}/objects/${objectPath}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadForm,
      });
      if (!putRes.ok) {
        const errText = await putRes.text();
        console.error("[api/chat/upload] direct upload failed", putRes.status, errText);
        return NextResponse.json(
          { error: `Upload failed: ${putRes.status} ${errText.slice(0, 200)}` },
          { status: putRes.status }
        );
      }
    } else {
      return NextResponse.json({ error: `Unknown strategy: ${strategy.method}` }, { status: 500 });
    }

    const key = strategy.key ?? path;
    const url = `${BASE}/api/storage/buckets/${BUCKET}/objects/${encodeURIComponent(key)}`;
    return NextResponse.json({ url, key });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[api/chat/upload]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
