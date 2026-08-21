import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// On Windows, fileURLToPath / process.cwd() may return lowercase 'desktop'
// while the actual filesystem has 'Desktop' (capital D). This causes webpack
// to see two different module identifiers for the same file, producing
// warnings and chunk-load errors. Fix by reading the parent directory and
// replacing any segment with its real-case equivalent.
function realPath(p) {
  // Walk up until we find an existing ancestor, then rebuild downward with
  // the real casing for each segment.
  const parts = p.split(/[\/\\]/).filter(Boolean)
  // Start from the root (e.g. C:\) or / on Unix
  let built = parts[0].includes(':') ? parts[0] + '/' : '/'
  for (let i = 1; i < parts.length; i++) {
    try {
      const entries = fs.readdirSync(built)
      const real = entries.find(e => e.toLowerCase() === parts[i].toLowerCase())
      built = path.posix.join(built, real || parts[i])
    } catch {
      built = path.posix.join(built, parts[i])
    }
  }
  return built
}

const __dirname = realPath(path.dirname(fileURLToPath(import.meta.url)))

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
  turbopack: {
    root: __dirname,
  },
  typescript: {
    // strict types enabled
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    // ── Windows casing fix ──────────────────────────────────────────
    // process.cwd() returns lowercase 'desktop' but the real directory
    // is 'Desktop'. Webpack resolves modules using cwd, creating two
    // identifiers for the same file.  Force ALL resolve paths to go
    // through the correctly-cased __dirname so webpack only sees one.
    if (dev) {
      // Override webpack's context (base dir) to use the real casing.
      config.context = __dirname
    }

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
