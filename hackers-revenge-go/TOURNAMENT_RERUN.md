# Tournament Rerun Feature

## Overview

The tournament rerun feature allows you to trigger a full tournament where the **top 20 players with programs** compete against each other in a round-robin format. This is useful for:

- Recalculating rankings after code changes or bug fixes
- Testing the battle engine with the best programs
- Refreshing the leaderboard with updated standings
- Running regular tournaments to keep rankings competitive

## How It Works

### Match Structure

When you trigger a full tournament rerun:

1. **Top 20 players selected** - The 20 highest-ranked players (by place, then score) are selected
2. **Round-robin format** - Each of the 20 players battles against every other player
3. **Bidirectional battles** - Each pair battles from both perspectives (A vs B and B vs A)
4. **Multiple rounds** - Each directional matchup is repeated `BattleMultiplier` times (default: 5), giving 10 total battles per pair
5. **Points reset** - All 20 players start from 0 wins/losses/ties before the tournament
6. **Final rankings** - Placements are recalculated based on the new results
7. **Scalability** - Works efficiently even with 100+ players in the database (only top 20 compete)

### Scoring

- **Win**: 2 points
- **Tie**: 1 point
- **Loss**: 0 points

## Usage

### Method 1: Using Make (Recommended)

```bash
cd hackers-revenge-go
make rerun
```

This command will:
- Trigger the tournament
- Show you the response
- Provide commands to monitor progress

### Method 2: Using the Script

```bash
cd hackers-revenge-go
./scripts/trigger_tournament.sh
```

### Method 3: Direct API Call

From inside the Docker container:

```bash
docker-compose exec server curl -X POST http://localhost:3000/tournament/rerun
```

### Method 4: Using curl from host (if nginx is configured)

```bash
curl -X POST http://localhost/admin/api/tournament/rerun
```

Note: This requires the nginx proxy to be configured to route `/admin/api/tournament/*` to the Go server.

## Monitoring Progress

### Watch the logs

```bash
docker-compose logs -f server | grep -i tournament
```

You'll see:
- "Starting full tournament run..." when it begins
- "Full tournament completed" when it finishes

### Check for errors

```bash
docker-compose logs server | grep -i "error\|failed"
```

## After Tournament Completion

### Check the updated leaderboard

```bash
docker-compose exec server curl -s http://localhost:3000/leaderboard | jq '.leaders'
```

Or visit: http://localhost/admin/api/leaderboard

### View updated player stats

All players will have refreshed:
- Wins, losses, ties counts
- Score (wins * 2 + ties)
- Place (rank based on score)
- Last battle ID

## Performance Considerations

### Tournament Duration

With the top-20 limit and concurrent architecture, tournaments complete consistently:

- **20 players** (1,900 battles): ~1 second
- **100+ players in database**: Still ~1 second (only top 20 compete)

The tournament processes 1,900 battles (20 × 19 × 5). Since battles are bidirectional, each pair effectively competes 10 times total (5 from each perspective). Execution time is predictable and fast regardless of total player count in the database.

### Resource Usage

- Runs as a background job (via Asynq worker)
- Does not block the API server
- CPU intensive during execution
- Memory usage: ~1-5 MB for battle computation, battles stored in memory until batch write completes
- **Battle Concurrency**: Uses 20 concurrent goroutines for in-memory battle computation
  - Phase 1: All battles computed concurrently in memory (no database writes) - highly parallel
  - Phase 2: All computed battles written to database in a single batch transaction
  - This approach eliminates database deadlocks while maintaining high performance
  - For 20 players (1,900 battles): Completes in ~1 second total
  - Consistent performance regardless of total players in database (always top 20 compete)

### Concurrent Tournaments

- Only one tournament can run at a time
- If you trigger multiple times, they will queue
- The worker processes them sequentially
- Each tournament uses 100 concurrent goroutines for battle computation, followed by batch database write

## Differences from Regular Matches

| Feature | Regular Match | Full Tournament |
|---------|--------------|-----------------|
| Players included | Contender + top 20 | Top 20 only |
| Points reset | No | Yes |
| When triggered | Program submission | Manual/API call |
| Purpose | Integrate new player | Recalculate top rankings |

## Example Output

### API Response

```json
{
  "message": "Full tournament queued for execution",
  "status": "queued"
}
```

### Log Output

```
2025/10/29 19:14:15 Starting full tournament run...
2025/10/29 19:14:32 Full tournament completed
```

### Updated Leaderboard

```json
{
  "leaders": [
    {
      "name": "Swift Wolf",
      "wins": 66,
      "losses": 9,
      "ties": 21,
      "score": 153
    },
    {
      "name": "Swift Tiger",
      "wins": 64,
      "losses": 18,
      "ties": 14,
      "score": 142
    }
    // ... more players
  ]
}
```

## Implementation Details

### Code Structure

- **Endpoint**: `POST /tournament/rerun` (internal/handlers/tournament.go)
- **Worker Task**: `TypeRunFullTournament` (internal/worker/client.go)
- **Match Logic**: `RunFullTournament()` (internal/models/match.go)
- **Battle Engine**: Same as regular matches (internal/engine/)

### Key Functions

#### `match.RunFullTournament()`
Tournament execution follows a two-phase architecture:

**Phase 1: Concurrent In-Memory Battle Computation**
- Loads top 20 players (by place, then score) with programs
- Pre-loads all instructions and player data
- Resets their points to 0
- Generates all battle pairs (round-robin: 20 × 19 = 380 unique pairs)
- Creates bidirectional matchups (380 pairs × 2 directions = 760 battles per round)
- Shuffles for randomness
- Spawns up to 20 goroutines to compute battles concurrently
- Each goroutine runs `BattleRunner.RunBattleInMemory()` which executes the battle engine purely in memory
- Collects all 1,900 battle results (760 directional matchups × 5 rounds) in memory
- Accumulates player stats updates (wins/losses/ties) in memory
- **No database writes during this phase** - completely parallel

**Phase 2: Batch Database Write**
- Once all battles computed, applies stats updates to player objects
- Writes all 1,900 battles to database in a single batch transaction (100 battles per batch)
- Updates player stats (wins, losses, ties, score, last_battle_id)
- Recalculates placements for top 20 based on new scores

This architecture eliminates database lock contention while maximizing CPU utilization. Each pair effectively competes 10 times (5 rounds × 2 directions). The top-20 limit ensures consistent ~1 second execution time regardless of total players in the database.

### Database Changes

- Player wins/losses/ties are overwritten
- Scores are recalculated
- Places are reassigned
- `last_battle_id` is updated for all players
- New battles are created in the database

## Use Cases

### 1. After Bug Fixes

If you fix a bug in the battle engine:

```bash
./scripts/trigger_tournament.sh
```

This ensures all rankings are based on the corrected logic.

### 2. Weekly/Monthly Tournaments

Schedule regular full tournaments:

```bash
# crontab example
0 0 * * 0 cd /path/to/hackers-revenge && ./scripts/trigger_tournament.sh
```

### 3. Testing New Programs

After multiple players submit new programs:

```bash
./scripts/trigger_tournament.sh
```

Get a complete picture of how all programs perform against each other.

### 4. Leaderboard Reset

Start fresh with a clean slate:

```bash
# Reset all player stats
docker-compose exec db mysql -u root -ppassword app -e "UPDATE players SET wins=0, losses=0, ties=0, score=0, place=NULL WHERE last_program_id IS NOT NULL"

# Run full tournament
./scripts/trigger_tournament.sh
```

## Troubleshooting

### "No players with programs found"

This means no players have submitted any programs yet. Submit at least 2 programs first.

### Tournament seems stuck

Check worker logs:
```bash
docker-compose logs server | tail -100
```

Look for error messages or battles that are failing.

### Unexpected rankings

Verify the battle engine is working correctly:
```bash
# Test a single battle
curl -X POST http://localhost/admin/api/test_round -H "Content-Type: application/json" -d '{...}'
```

### Resource exhaustion (too many players)

If you have >100 players, consider:
- Increasing worker concurrency
- Running on a more powerful machine
- Limiting tournaments to top N players

## Future Enhancements

Possible improvements:
- [ ] Add tournament progress indicator (% complete)
- [ ] Support partial tournaments (e.g., only top 50)
- [ ] Tournament history tracking
- [ ] Email notifications on completion
- [ ] Web UI button to trigger tournaments
- [ ] Scheduled automatic tournaments
- [ ] Tournament replay/analytics
