import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
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
      ignored: [...existingIgnored, '**/.freebuff/**', '**/tsconfig.tsbuildinfo'],
    }
    return config
  },
}

export default nextConfig

