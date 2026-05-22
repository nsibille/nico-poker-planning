#!/usr/bin/env node
/**
 * Apply pending Supabase migrations via the Management API.
 *
 * Reads every *.sql under supabase/migrations/ in lexical order, skips the ones
 * already recorded in the _claude_migrations tracking table, applies the rest
 * inside a single statement each, and records them.
 *
 * Credentials (set in your Claude Code environment — see README):
 *   - SUPABASE_ACCESS_TOKEN   the Personal Access Token from your Supabase
 *                             account (same one you put in .mcp.json)
 *   - SUPABASE_PROJECT_REF    the project ref shown in the dashboard URL
 *                             (e.g. "abcxyz123" — NOT the "lima-185" room id)
 *
 * Usage:
 *   node scripts/apply-migrations.mjs
 *   npm run migrate
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations')

const token = process.env.SUPABASE_ACCESS_TOKEN
const ref = process.env.SUPABASE_PROJECT_REF

if (!token || !ref) {
  console.log('[migrate] SUPABASE_ACCESS_TOKEN ou SUPABASE_PROJECT_REF non défini — skip.')
  console.log('[migrate] Pour activer l\'auto-application des migrations en session web,')
  console.log('[migrate] ajoute ces deux variables dans la config de ton environnement Claude Code.')
  process.exit(0)
}

const API = `https://api.supabase.com/v1/projects/${ref}/database/query`

async function runSql(sql) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`HTTP ${res.status} — ${body}`)
  }
  return res.json().catch(() => null)
}

async function ensureTrackingTable() {
  await runSql(`
    create table if not exists public._claude_migrations (
      filename   text primary key,
      applied_at timestamptz not null default now()
    );
  `)
}

async function appliedSet() {
  const rows = await runSql('select filename from public._claude_migrations;')
  // Management API returns either rows array or {result: rows} depending on
  // version — handle both shapes defensively.
  const list = Array.isArray(rows) ? rows : (rows?.result ?? [])
  return new Set(list.map(r => r.filename))
}

async function main() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()

  if (files.length === 0) {
    console.log('[migrate] Aucune migration trouvée.')
    return
  }

  console.log(`[migrate] Connexion à projet ${ref}…`)
  await ensureTrackingTable()
  const applied = await appliedSet()

  let appliedCount = 0
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[migrate] ✓ ${file} (déjà appliquée)`)
      continue
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
    process.stdout.write(`[migrate] ↻ ${file} … `)
    try {
      await runSql(sql)
      await runSql(`insert into public._claude_migrations (filename) values ('${file.replace(/'/g, "''")}');`)
      console.log('OK')
      appliedCount++
    } catch (err) {
      console.log('ÉCHEC')
      console.error(`[migrate] ${file} : ${err.message}`)
      process.exit(1)
    }
  }

  console.log(`[migrate] Terminé — ${appliedCount} nouvelle(s) migration(s) appliquée(s), ${files.length - appliedCount} déjà à jour.`)
}

main().catch(err => {
  console.error(`[migrate] Erreur fatale : ${err.message}`)
  process.exit(1)
})
