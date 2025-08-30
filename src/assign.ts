import type { Scored } from './scoring.js';

export interface Assignment { player_id: string; new_team: number; score: number; }

export function assignTeams(sorted: Scored[], teams: number): Assignment[] {
  if (teams < 1) throw new Error('teams must be >= 1');
  const res: Assignment[] = [];
  let direction = 1; let idx = 0;

  while (idx < sorted.length) {
    if (direction === 1) {
      for (let t = 1; t <= teams && idx < sorted.length; t++, idx++) {
        const item = sorted[idx]!;  // <- avoid "possibly undefined"
        res.push({ player_id: String(item.player_id), new_team: t, score: item._score });
      }
      direction = -1;
    } else {
      for (let t = teams; t >= 1 && idx < sorted.length; t--, idx++) {
        const item = sorted[idx]!;
        res.push({ player_id: String(item.player_id), new_team: t, score: item._score });
      }
      direction = 1;
    }
  }
  return res;
}
