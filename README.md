# Gyld Season Reshuffle – Team Assignment

Deterministic reassignment of players into **T** teams for a new **Gyld season**, using a simple, transparent fairness heuristic.  
Aligned with Gyld’s principles of **seasons, rituals, and community trust**: reshuffles should feel fair, reproducible, and easy to explain.

---

## 🚀 Run Instructions

Install dependencies:
```bash
npm install
```

Run with desired number of teams:
```bash
npx tsx src/index.ts --teams 3 --input data/level_a_players.xlsx
```

Options:
- `--teams <N>` (required): number of teams to form.
- `--input <path>` (optional): `.xlsx` or `.csv` dataset. Default: `data/level_a_players.xlsx`.

Outputs:
- **Console**: `player_id,new_team` mapping + per-team summary + justification.
- **Files**:  
  - `out/assignments.csv`  
  - `out/team_summary.json`

---

## 🧠 Approach & Trade-offs (“I did X because Y”)

- **Composite engagement score (X)** because **it balances recency, participation, and messages in a way players can understand (Y)**.  
- **Snake draft assignment (X)** because **it spreads high-engagement players evenly while keeping team sizes balanced within ±1 (Y)**.  
- **Deterministic tie-break (X)** because **community trust depends on reproducibility and clarity (Y)**.  
- **Omitted Level B logs (X)** because **time-boxed to ~2h, keeping focus on an explainable baseline (Y)**.  

---

## 🔧 One Modeling Choice & Why

I chose to weight **recent activity (`days_active_last_30`) at 50%** of the engagement score.  
Reason: activity in the last month is the clearest indicator of who will actively participate in the upcoming season, which makes the reshuffle feel fair.

---

## 🔒 Tie-break Rule

If two players have the same composite score, assign first the one with **lower `player_id` (ascending string compare)**.  
This ensures deterministic and reproducible results.

---

## 📌 Assumptions

- Input data is **trusted** (provided by Gyld, not arbitrary user uploads).  
- Only **Level A dataset** was used (players). Level B (events/messages/spend) was skipped due to timebox.  
- Players can be fully reshuffled; no continuity with `current_team_id` is preserved.  

---

## ⏭️ If I Had More Time, I Would…

- Incorporate **Level B logs** to decay engagement by recency and detect inactive players.  
- Add **compatibility/continuity constraints** (e.g., avoid stacking all high-streak players, preserve friend groups).  
- Parameterize **weights** so each community can tune fairness priorities.  
- Generate a **visual HTML report** with charts and plain-language fairness explanation for players.  

---

## 🤖 Indication of AI Usage

**AI was used.** See `prompts/` (example prompts) and `FIXES.md` (manual corrections) for details.

---

## ⏱️ Time Spent

**01:50** (hh:mm) — design, implementation, testing, and documentation.  
