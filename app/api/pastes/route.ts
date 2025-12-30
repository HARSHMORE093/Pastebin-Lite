import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";
import { getNowMs } from "@/lib/time";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body ?? {};

  if (!content || typeof content !== "string" || content.trim() === "") {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return NextResponse.json({ error: "ttl_seconds must be integer >=1" }, { status: 400 });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return NextResponse.json({ error: "max_views must be integer >=1" }, { status: 400 });
  }

  const id = nanoid(12);
  const now = getNowMs(req.headers);

  const data = {
    content,
    created_at: now,
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    views: 0
  };

  await redis.set(`paste:${id}`, JSON.stringify(data));

  const base = process.env.BASE_URL || "";
  return NextResponse.json(
    {
      id,
      url: `${base}/p/${id}`
    },
    { status: 201 }
  );
}
