This is a **real-time chat** app built with [Next.js](https://nextjs.org) and [InsForge](https://insforge.dev) (auth, realtime messaging, presence).

## InsForge setup

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
