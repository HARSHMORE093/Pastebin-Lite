# Pastebin-Lite

A minimal **Pastebin-style web application** built with **Next.js** and **Redis**.  
Users can create text pastes, receive a shareable URL, and optionally set:

- ⏳ **Time-to-Live (TTL)** — expires after N seconds  
- 👀 **Max Views** — paste becomes unavailable after N views  

As soon as **either constraint triggers**, the paste becomes unavailable and returns **HTTP 404**.

This project is built to satisfy the **Pastebin-Lite Take-Home Assignment** requirements.

---

## 🚀 Live App

Production URL (example):
https://pastebin-lite-seven-gold.vercel.app


---

## 🏗 Tech Stack

- Next.js (App Router)
- TypeScript
- Redis (persistent storage; serverless-friendly)
- Deployed on Vercel

---

## ✨ Core Features

- Create a paste via UI or `POST /api/pastes`
- Get a shareable link `/p/:id`
- Fetch paste as JSON `/api/pastes/:id`
- Optional TTL expiry
- Optional view-count limiting
- Deterministic time support for testing (`TEST_MODE + x-test-now-ms`)
- Secure HTML rendering (XSS-safe)
- Health check endpoint `/api/healthz`
- Persistent storage (no in-memory loss)

---

## 🗄 Persistence Layer

This app uses **Redis** via a hosted provider such as **Upstash / Redis Cloud**.

The connection string is provided via:
REDIS_URL=redis://default:<password>@<host>:<port>


No secrets are committed to the repository.

---

# 🛠 Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- A Redis database

---

## 1️⃣ Install dependencies

```bash
npm install


2️⃣ Create .env.local

Create this file in the project root:
BASE_URL=http://localhost:3000
REDIS_URL=redis://default:<password>@<host>:<port>
TEST_MODE=0

3️⃣ Run the development server
npm run dev


App runs at:
http://localhost:3000

