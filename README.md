# Real-Time Chat App

A modern real-time chat application built with Next.js and InsForge for authentication, live messaging, and presence.

---

## Project Overview

This application provides **real-time chat** with support for a main room, direct messages, user presence (online/offline), and optional image/file attachments. Users can sign in, join the main channel, see who is online, and send messages that appear instantly for all participants. The app is PWA-ready and works on desktop and mobile.

---

## Project Structure

```
realtimehexachat/
├── app/
│   ├── (app)/chat/          # Chat UI and real-time messaging
│   ├── (marketing)/         # Landing, about, features, pricing, etc.
│   ├── api/chat/upload/     # File upload API for attachments
│   ├── auth/                # Sign-in page
│   ├── layout.tsx
│   ├── globals.css
│   └── manifest.ts          # PWA manifest
├── components/
│   ├── chat/                # ChatHeader, ChatSidebar, MessageBubble, MessageInput
│   └── layout/              # Navbar, Footer, InstallPrompt
├── hooks/
│   └── useChat.ts           # Chat state and real-time subscription
├── lib/
│   └── auth-context.tsx     # Auth state and provider
├── services/
│   └── insforge.ts          # InsForge client and helpers
├── types/
│   └── index.ts             # Shared TypeScript types
├── scripts/
│   ├── create-realtime-channels.mjs
│   └── check-db.mjs / check-db.mts
├── migrations/              # SQL migrations (e.g. message attachments)
├── docs/
│   └── INSFORGE_REFERENCE.md
├── public/                  # Static assets, PWA workers (sw.js, workbox)
├── database-schema.sql
├── next.config.ts
├── package.json
└── .env.local.example
```

---

## Technical Stack

| Layer        | Technology |
| ------------ | ---------- |
| Framework    | [Next.js](https://nextjs.org) 16 (App Router) |
| UI           | React 19, [Tailwind CSS](https://tailwindcss.com) 4, [Lucide React](https://lucide.dev) |
| Backend / BaaS | [InsForge](https://insforge.dev) (auth, realtime channels, presence, storage) |
| Realtime     | InsForge SDK (`@insforge/sdk`) – channels & presence |
| PWA          | `@ducanh2912/next-pwa` |
| Language     | TypeScript 5 |
| Tooling      | ESLint, PostCSS |

---

## Development Team

**Surag** — [**Hexa Stack Solutions**](https://github.com/suragms)

Hexa Stack Solutions is a branch launched in **Thrissur** in **December 2024**, focused on full-stack and real-time application development.

---

## InsForge Setup

1. **Backend**: Create an InsForge project and get your **base URL** and **anon key** (dashboard or `get-backend-metadata` MCP).
2. **Env**: Copy `.env.local.example` to `.env.local` and set:
   - `NEXT_PUBLIC_INSFORGE_BASE_URL`
   - `NEXT_PUBLIC_INSFORGE_ANON_KEY`
3. **Realtime channels**: In InsForge (dashboard or MCP), create channels so the app can subscribe and publish:
   - `chat:main` – main room messages (event: `new_message`)
   - `chat:dm:%` or pattern that allows `chat:dm:userId1:userId2` – for 1:1 DMs (event: `new_message`)
   - `presence:main` – for presence (events: `user_online`, `user_offline`)
4. **Image/file attachments**: To send images in chat:
   - **Storage**: In InsForge → Storage, create a bucket named `chat-attachments` (or set `NEXT_PUBLIC_CHAT_ATTACHMENTS_BUCKET`).
   - **Database**: Ensure the `messages` table has columns `attachment_url`, `attachment_name`, `attachment_type` (text, nullable). Run `migrations/add-messages-attachment-columns.sql` or the simple version if needed.

---

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Create realtime channels (if needed): `npm run create-realtime-channels`

---

## Conclusion

Real-Time Chat App demonstrates a full-stack, real-time experience using Next.js and InsForge: authentication, live messaging, presence, and optional file attachments in a clear, maintainable structure. Developed by **Surag** at **Hexa Stack Solutions** (Thrissur, December 2024). For more on Next.js, see the [Next.js Documentation](https://nextjs.org/docs); for deployment, see [Deploying on Vercel](https://nextjs.org/docs/app/building-your-application/deploying).
