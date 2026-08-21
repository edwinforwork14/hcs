import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// On Windows, process.cwd() may return lowercase 'desktop' while the real
// filesystem has 'Desktop' (capital D).  fs.realpathSync.native gives the
// actual on-disk casing.  Use it everywhere so webpack sees a single path
// per module instead of two that only differ in case.
const realDirname = fs.realpathSync.native(
  path.dirname(fileURLToPath(import.meta.url)),
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: realDirname,
  turbopack: {
    root: realDirname,
  },
  typescript: {},
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    // Force webpack's context + resolve root to use the real on-disk casing
    // so node_modules modules are resolved from one path only.
    config.context = realDirname
    if (config.resolve) {
      config.resolve.modules = [
        path.join(realDirname, 'node_modules'),
        'node_modules',
      ]
    }

    // Stop the dev watcher from reacting to files that change constantly
    // without being part of the app (e.g. the Freebuff desktop app's local
    // database, which is written on every chat activity).
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
