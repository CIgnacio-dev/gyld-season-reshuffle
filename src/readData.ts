import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import type { Player } from './types.js';

/**
 * Read players from an .xlsx or .csv file.
 * Defaults to sheet 0 if Excel.
 */
export function readPlayers(inputPath: string): Player[] {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  // Defensive check: file size limit
  const stats = fs.statSync(inputPath);
  const MAX_SIZE_MB = 10;
  if (stats.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Input too large (> ${MAX_SIZE_MB} MB).`);
  }

  const ext = path.extname(inputPath).toLowerCase();

  if (ext === '.xlsx' || ext === '.xls') {
    // Read first sheet only
    const buf = fs.readFileSync(inputPath);
    const wb = XLSX.read(buf, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const MAX_ROWS = 100_000;
    const json = XLSX.utils.sheet_to_json(sheet, { defval: null }).slice(0, MAX_ROWS);
    return json.map(row => normalizeRow(row as any));
  }

  if (ext === '.csv') {
    const csv = fs.readFileSync(inputPath, 'utf8');
    const parsed = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
    if (parsed.errors.length) {
      throw new Error(`CSV parse errors: ${parsed.errors.map(e => e.message).join('; ')}`);
    }
    return (parsed.data as any[]).map(row => normalizeRow(row));
  }

  throw new Error(`Unsupported file extension: ${ext}`);
}

function normalizeRow(row: any): Player {
  return {
    player_id: String(row.player_id ?? row.id ?? ''),
    current_team_id: row.current_team_id ?? null,
    current_team_name: row.current_team_name ?? null,
    historical_events_participated: asNum(row.historical_events_participated ?? row.events_participated),
    historical_event_engagements: asNum(row.historical_event_engagements ?? row.event_engagements),
    historical_points_earned: asNum(row.historical_points_earned ?? row.points_earned),
    historical_points_spent: asNum(row.historical_points_spent ?? row.points_spent),
    current_total_points: asNum(row.current_total_points ?? row.total_points),
    historical_messages_sent: asNum(row.historical_messages_sent ?? row.messages_sent),
    days_active_last_30: asNum(row.days_active_last_30 ?? row.days_active_30),
    current_streak_value: asNum(row.current_streak_value ?? row.streak_value),
    last_active_ts: asNum(row.last_active_ts ?? row.last_active),
  };
}

function asNum(v: any): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
