#!/bin/bash
set -e

# ARGUMENTS
TYPE=${1:-feat}
TICKET=${2:-no-ticket}
BASE_BRANCH=${3:-dev}
# Claude-generated description
DESCRIPTION=${4:-"Auto-generated changes by Claude Code"}

# Generate unique branch name
CURRENT_BRANCH=$(git branch --show-current)
TIMESTAMP=$(date +%s)
NEW_BRANCH="$TYPE/$TICKET-$TIMESTAMP"

echo "🚀 Starting Smart Git Flow..."
echo "CONTEXT: $TYPE | $TICKET | $BASE_BRANCH"
echo "DESCRIPTION: $DESCRIPTION"

# 1. UPDATE AND CREATE BRANCH
git fetch origin $BASE_BRANCH
git checkout $BASE_BRANCH
git pull origin $BASE_BRANCH
git checkout -b $NEW_BRANCH

# 2. DETECT AND PUSH CHANGES
if [ -n "$(git status --porcelain)" ]; then
  git add .
  # Use the generated description in the commit as well
  git commit -m "$TYPE($TICKET): $DESCRIPTION"
else
  echo "⚠️ No pending changes (did you already commit?). Continuing..."
fi

# 3. SAFETY CHECK (Merge Tree)
# Check for conflicts without touching the working directory
if git merge-tree $(git merge-base HEAD origin/$BASE_BRANCH) HEAD origin/$BASE_BRANCH | grep -q "Conflict"; then
    echo "❌ CRITICAL ERROR: Conflicts detected with $BASE_BRANCH."
    echo "Cannot automate the PR. Resolve them manually."
    git checkout $CURRENT_BRANCH
    exit 1
fi

# 4. PUSH
git push origin $NEW_BRANCH

# 5. PREPARE PR BODY
# Use pipe | in sed to avoid errors if description contains slashes
# Escape double quotes in description for JSON/Bash safety
CLEAN_DESC=$(echo "$DESCRIPTION" | sed 's/"/\\"/g')

TEMPLATE_FILE=".github/PULL_REQUEST_TEMPLATE_CUSTOM.md"

if [ -f "$TEMPLATE_FILE" ]; then
    # Replace variables in the template
    BODY=$(cat "$TEMPLATE_FILE" | sed "s|\${TICKET_ID}|$TICKET|g" | sed "s|\${DESCRIPTION}|$CLEAN_DESC|g")
else
    # Fallback when no template
    BODY="## Ticket $TICKET\n\n$DESCRIPTION"
fi

# 6. CREATE PR
echo "📝 Creating PR on GitHub..."
PR_URL=$(gh pr create \
  --base $BASE_BRANCH \
  --head $NEW_BRANCH \
  --title "$TYPE($TICKET): $DESCRIPTION" \
  --body "$BODY")

echo "✅ SUCCESS. PR created: $PR_URL"