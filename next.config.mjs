import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: dev runs with --webpack (Turbopack has a CSS parsing bug on this
  // machine), so no `turbopack` block here. An explicit turbopack.root made
  // Next's config watcher loop (“Found a change in next.config.mjs” restarts)
  // because stray lockfiles in the user HOME confuse workspace-root inference.
  //
  // outputFileTracingRoot: stray lockfiles in the user HOME (e.g.
  // C:\Users\Edwin\pnpm-lock.yaml) make Next infer the HOME as the workspace
  // root. The dev watcher then watches the whole HOME tree and recompiles on
  // every unrelated file write (temp files, browser cache, …), which shows up
  // as constant page reloads. Pin the root to this project directory.
  outputFileTracingRoot: __dirname,
  // Production builds run with Turbopack (Next 16 default on Vercel). The
  // `webpack` config below is dev-only (watcher ignores), so declare an
  // empty turbopack config to satisfy the build.
  turbopack: {},
  typescript: {
    // strict types enabled
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Stop the dev watcher from reacting to files that change constantly
    // without being part of the app (e.g. the Freebuff desktop app's local
    // database, which is written on every chat activity). Those writes
    // otherwise trigger endless HMR recompiles and the page "updates"
    // by itself every few seconds in dev mode.
    const existingIgnored = Array.isArray(config.watchOptions?.ignored)
      ? config.watchOptions.ignored
      : []
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...existingIgnored,
        '**/.freebuff/**',
        '**/.next/**',
        '**/tsconfig.tsbuildinfo',
      ],
    }
    return config
  },
}

export default nextConfig
