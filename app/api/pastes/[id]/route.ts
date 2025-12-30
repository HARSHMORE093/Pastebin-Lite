import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getNowMs } from "@/lib/time";

function expired(obj: any, now: number) {
  if (obj.ttl_seconds) {
    const expires = obj.created_at + obj.ttl_seconds * 1000;
    return now >= expires;
  }
  return false;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const key = `paste:${id}`;
  const raw = await redis.get(key);
  if (!raw)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const obj = JSON.parse(raw);
  const now = getNowMs(_req.headers);

  if (expired(obj, now))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (obj.max_views !== null) {
    if (obj.views >= obj.max_views)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    obj.views += 1;
    await redis.set(key, JSON.stringify(obj));
  }

  const remaining =
    obj.max_views === null ? null : Math.max(obj.max_views - obj.views, 0);

  const expires_at =
    obj.ttl_seconds === null
      ? null
      : new Date(obj.created_at + obj.ttl_seconds * 1000).toISOString();

  return NextResponse.json(
    {
      content: obj.content,
      remaining_views: remaining,
      expires_at
    },
    { status: 200 }
  );
}
