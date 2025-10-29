#!/bin/bash

# Trigger a full tournament rerun
# This will run matches between all players with programs (not just top 10)

set -e

echo "Triggering full tournament rerun..."

# Call the endpoint directly on the server container
RESPONSE=$(docker-compose exec -T server curl -s -X POST http://localhost:3000/tournament/rerun)

echo "Response: $RESPONSE"

# Check if it was successful
if echo "$RESPONSE" | grep -q "queued"; then
    echo ""
    echo "✓ Tournament queued successfully!"
    echo ""
    echo "Monitor progress with:"
    echo "  docker-compose logs -f server | grep -i tournament"
    echo ""
    echo "Check updated leaderboard after completion:"
    echo "  docker-compose exec server curl -s http://localhost:3000/leaderboard | jq '.leaders'"
else
    echo ""
    echo "✗ Failed to queue tournament"
    exit 1
fi
