#!/bin/bash
# Pre-Hook: Context Compactor
# Purpose: Save a lightweight "snapshot" of the project state so Claude doesn't have to explore everything from scratch.

MEMORY_FILE=".claude/memory/current_state.md"
COUNTER_FILE=".claude/memory/cmd_counter"
THRESHOLD=10  # Run every 10 commands

# 1. Counter Management
if [ ! -f "$COUNTER_FILE" ]; then echo "0" > "$COUNTER_FILE"; fi
COUNT=$(cat "$COUNTER_FILE")
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

# 2. Check if compaction is needed (Every X commands)
if [ "$COUNT" -ge "$THRESHOLD" ]; then
    echo "♻️ Compacting local context to save tokens..."

    # Initialize file
    echo "# Compact Project State ($(date))" > "$MEMORY_FILE"
    echo "Use this file to understand the structure without spending tokens on 'ls -R' or exploration." >> "$MEMORY_FILE"

    # A. File Structure (Ignoring node_modules and .git)
    echo -e "\n## 1. Key File Map" >> "$MEMORY_FILE"
    if command -v tree &> /dev/null; then
        tree -L 3 -I 'node_modules|dist|.git|.next' >> "$MEMORY_FILE"
    else
        find . -maxdepth 3 -not -path '*/.*' >> "$MEMORY_FILE"
    fi

    # B. Git State (What you've changed recently)
    echo -e "\n## 2. Recent Changes (Git Dirty State)" >> "$MEMORY_FILE"
    git status --short >> "$MEMORY_FILE"
    echo -e "\n## 3. Last 5 Commits" >> "$MEMORY_FILE"
    git log -n 5 --oneline >> "$MEMORY_FILE"

    # C. CLAUDE.md Content (Active rules)
    echo -e "\n## 4. Active Rules" >> "$MEMORY_FILE"
    cat CLAUDE.md >> "$MEMORY_FILE"

    # Reset counter
    echo "0" > "$COUNTER_FILE"
    
    echo "✅ Context saved to $MEMORY_FILE"
else
    # If compaction is not due, exit silently
    exit 0
fi
