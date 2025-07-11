#!/bin/bash

# Test script to manually trigger the daily queue completion
# Usage: ./test-daily-completion.sh [BASE_URL]

BASE_URL=${1:-"http://localhost:3000"}

echo "Testing daily queue completion at $BASE_URL..."

response=$(curl -s -X POST "$BASE_URL/api/cron/complete-daily" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n")

echo "Response:"
echo "$response"
