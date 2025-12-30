import { redis } from "@/lib/redis";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function Page({ params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;
  const raw = await redis.get(key);
  if (!raw) return <h1>404 – Not Found</h1>;

  const obj = JSON.parse(raw);
  const now = Date.now();

  if (obj.ttl_seconds && now >= obj.created_at + obj.ttl_seconds * 1000)
    return <h1>404 – Not Found</h1>;

  if (obj.max_views !== null && obj.views >= obj.max_views)
    return <h1>404 – Not Found</h1>;

  obj.views += 1;
  await redis.set(key, JSON.stringify(obj));

  const safe = escapeHtml(obj.content);

  return (
    <main style={{ padding: 20 }}>
      <pre>{safe}</pre>
    </main>
  );
}
