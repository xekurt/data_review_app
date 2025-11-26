## AI usage
AI model: "GROK AI V-4.1"
prompt: "Generate a JSON array of 2-3 pharmaceutical manufacturing processes. Each process has an id, name, description, status ('Pending'), lastUpdatedBy ('System'), lastUpdatedAt (ISO timestamp). Each process has 2-4 subprocesses with similar fields. Each subprocess has 3-6 tasks with similar fields. Make it realistic for a pharma SME."
Manually adjust: Ensure hierarchy (processes contain subprocesses, which contain tasks) and set initial statuses to 'Pending'.

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

