#!/usr/bin/env bash
# Pre-Hook: Security Firewall
set -euo pipefail

# Extract the command
input=$(cat -)
cmd=$(echo "$input" | jq -r '.tool_input.command // .tool_input.path // ""')

# 1. Block destructive actions
if echo "$cmd" | grep -Eq 'rm -rf|git reset --hard|drop table|prod'; then
    echo "BLOCKED: Destructive command or production environment detected." 1>&2
    exit 2
fi

# 2. API keys and secrets protection
if echo "$cmd" | grep -Eq '\.env|secrets|credentials'; then
    echo "BLOCKED: Unauthorized access to secrets per security policy." 1>&2
    exit 2
fi

exit 0