import type { Assignment } from './assign.js';

export interface TeamSummary { team: number; size: number; avg_score: number; }

export function summarize(assignments: Assignment[]): TeamSummary[] {
  const byTeam = new Map<number, {sum: number, count: number}>();
  for (const a of assignments) {
    const agg = byTeam.get(a.new_team) ?? { sum: 0, count: 0 };
    agg.sum += a.score; agg.count += 1; byTeam.set(a.new_team, agg);
  }
  const out: TeamSummary[] = [];
  for (const [team, {sum, count}] of byTeam.entries()) {
    out.push({ team, size: count, avg_score: count ? sum / count : 0 });
  }
  out.sort((a,b) => a.team - b.team);
  return out;
}

export function printSummary(summaries: TeamSummary[]) {
  console.log('\n=== Team Summary ===');
  for (const s of summaries) {
    console.log(`Team ${s.team}: size=${s.size}, avg_engagement_score=${s.avg_score.toFixed(3)}`);
  }
  console.log('\nJustification: For the season reshuffle, teams are formed via a snake-draft over a composite engagement score (recent activity, events, messages) so each team gets a comparable mix of highly and moderately engaged players. Deterministic & reproducible for community trust.');
}
