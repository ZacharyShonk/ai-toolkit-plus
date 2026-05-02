This is the [Next.js](https://nextjs.org) web UI for AI Toolkit.

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

Open [http://localhost:8675](http://localhost:8675) with your browser to see the result.

## Updating The Container

If you run the UI through the repo-level Podman or Docker compose setup, rebuilding the image is not enough by itself. You must recreate the compose service so the running container uses the new image.

From the repository root, with Podman:

```bash
podman compose build ai-toolkit
podman compose up -d --force-recreate ai-toolkit
```

With Docker:

```bash
docker compose build ai-toolkit
docker compose up -d --force-recreate ai-toolkit
```

Do not use `podman start <container-id>` or `docker start <container-id>` when you expect code changes to appear. Those commands only restart the existing container and keep the old image.

To verify Podman is running the latest image:

```bash
podman image inspect --format '{{.Id}}' localhost/ai-toolkit-local:latest
podman inspect --format '{{.Image}}' ai-toolkit-plus_ai-toolkit_1
```

The two IDs should match.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
