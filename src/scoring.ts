import type { Player } from './types.js';

export interface Scored extends Player { _score: number; }

export function computeScore(p: Player): number {
  const days = safe(p.days_active_last_30);
  const events = safe(p.historical_events_participated);
  const msgs = safe(p.historical_messages_sent);
  const ndays = clamp(days / 30, 0, 1);
  const nevents = clamp(events / 20, 0, 1);
  const nmsgs = clamp(msgs / 200, 0, 1);
  return 0.5 * ndays + 0.3 * nevents + 0.2 * nmsgs;
}

export function scoreAndSort(players: Player[]) {
  const scored = players.map(p => ({ ...p, _score: computeScore(p) }));
  scored.sort((a, b) => (b._score - a._score) || String(a.player_id).localeCompare(String(b.player_id)));
  return scored;
}

function clamp(x: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, x)); }
function safe(x?: number) { return typeof x === 'number' && Number.isFinite(x) ? x : 0; }
