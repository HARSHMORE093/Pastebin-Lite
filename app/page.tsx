"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined
      })
    });

    const data = await res.json();
    if (res.ok) setUrl(data.url);
    else alert(JSON.stringify(data));
  }

  return (
    <main style={{ padding: 20, maxWidth: 600 }}>
      <h1>Pastebin-Lite</h1>
      <form onSubmit={submit}>
        <textarea
          rows={6}
          style={{ width: "100%" }}
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <input
          placeholder="TTL seconds"
          value={ttl}
          onChange={e => setTtl(e.target.value)}
        />

        <input
          placeholder="Max views"
          value={views}
          onChange={e => setViews(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>

      {url && (
        <p>
          Link: <a href={url}>{url}</a>
        </p>
      )}
    </main>
  );
}
