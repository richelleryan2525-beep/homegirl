# Home Girl Application (Next.js + Vercel)

Deploy: push to GitHub, import into Vercel, then Storage -> Create Blob store -> connect to the project, and redeploy.
Local dev needs the Blob token: `npx vercel link && npx vercel env pull .env.local && npm run dev`
