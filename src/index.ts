import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs';
import { readPlayers } from './readData.js';
import { scoreAndSort } from './scoring.js';
import { assignTeams } from './assign.js';
import { summarize, printSummary } from './summary.js';

const argv = yargs(hideBin(process.argv))
  .option('teams', { type: 'number', demandOption: true, describe: 'Number of teams (T)' })
  .option('input', { type: 'string', default: 'data/level_a_players.xlsx', describe: 'Path to Level A players file (.xlsx or .csv)' })
  .strict()
  .parseSync();

const inputPath = path.resolve(argv.input);
const players = readPlayers(inputPath);
if (players.length === 0) { console.error('No players found in input.'); process.exit(1); }

const scored = scoreAndSort(players);
const assignments = assignTeams(scored, argv.teams);

console.log('player_id,new_team');
for (const a of assignments) console.log(`${a.player_id},${a.new_team}`);

const summaries = summarize(assignments);
printSummary(summaries);

const outDir = path.resolve('out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'assignments.csv'), ['player_id,new_team', ...assignments.map(a => `${a.player_id},${a.new_team}`)].join('\n'));
fs.writeFileSync(path.join(outDir, 'team_summary.json'), JSON.stringify(summaries, null, 2));

console.log('\nTie-break rule: score desc, then player_id asc (string compare).');
