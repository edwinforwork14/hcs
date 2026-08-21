// Fix Windows casing issue: process.cwd() returns lowercase 'desktop'
// but the real directory is 'Desktop'.  This causes webpack to see two
// module identifiers for the same file.  chdir to the real path forces
// Node and all child processes (Next.js, webpack) to use the correct case.
const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

const realCwd = fs.realpathSync.native('.')
console.log('[casing-fix] Switching cwd to:', realCwd)
process.chdir(realCwd)
console.log('[casing-fix] process.cwd() is now:', process.cwd())

const args = process.argv.slice(2)
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const child = spawn(cmd, ['next', 'dev', '--webpack', '--port', '3000', ...args], {
  stdio: 'inherit',
  cwd: realCwd,
  shell: true,
})

child.on('exit', (code) => process.exit(code ?? 0))
