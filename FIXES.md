# FIXES.md

Concrete fixes I applied to AI output to meet the brief and make the project run reliably:

1) **ESM execution on Windows**  
   - **Issue:** AI suggested using `ts-node-esm`, but I got `ERR_UNKNOWN_FILE_EXTENSION`.  
   - **Fix:** Switched to `npx tsx` for execution with `"module": "NodeNext"` in `tsconfig.json`.  
   - **Files:** `package.json`, `tsconfig.json`.

2) **Local imports under NodeNext**  
   - **Issue:** AI initially used bare imports (`./types`), which failed under TS5 + NodeNext.  
   - **Fix:** Changed all local imports to include `.js` extension (e.g. `./types.js`).  
   - **Files:** `src/*.ts`.

3) **XLSX in ESM**  
   - **Issue:** AI suggested `XLSX.readFile`, which doesn’t work under pure ESM.  
   - **Fix:** Replaced with `fs.readFileSync` + `XLSX.read(buffer, { type: 'buffer' })`.  
   - **Files:** `src/readData.ts#readPlayers`.

4) **Determinism & tie-break**  
   - **Issue:** AI’s sort comparator could return 0 for ties, leaving order undefined.  
   - **Fix:** Added explicit secondary key `player_id` (ascending string compare).  
   - **Files:** `src/scoring.ts#scoreAndSort`.

5) **CLI args with npm**  
   - **Issue:** Running `npm start -- --teams 3` lost the flag on Windows.  
   - **Fix:** Updated run instructions to use `npx tsx src/index.ts --teams 3`.  
   - **Files:** `README.md`.
