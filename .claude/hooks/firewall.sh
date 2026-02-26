#!/usr/bin/env bash
# Pre-Hook: Security Firewall
set -euo pipefail

# Read tool input from stdin
input=$(cat -)

# Extract command or path using bash (no jq dependency)
cmd=$(echo "$input" | grep -oP '"command"\s*:\s*"\K[^"]+' 2>/dev/null || true)
path=$(echo "$input" | grep -oP '"path"\s*:\s*"\K[^"]+' 2>/dev/null || true)
target="${cmd}${path}"

# 1. Block destructive actions
if echo "$target" | grep -Eq 'rm -rf|git reset --hard|drop table|prod'; then
    echo "BLOCKED: Destructive command or production environment detected." 1>&2
    exit 2
fi

# 2. API keys and secrets protection (only block shell access, not file tools)
if echo "$cmd" | grep -Eq '\.env|secrets|credentials'; then
    echo "BLOCKED: Unauthorized shell access to secrets per security policy." 1>&2
    exit 2
fi

exit 0
