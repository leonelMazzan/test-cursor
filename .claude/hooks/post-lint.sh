#!/usr/bin/env bash
# Post-Hook: Linting and Tests
set -euo pipefail

echo "Checking generated code quality..."

# Run linter (React/Vite project)
if ! pnpm run lint; then
    echo "Linting error detected. Fix the style." 1>&2
    exit 2
fi

# Run tests (optional, enable when tests exist)
# if ! pnpm test -- --run; then
#     echo "Tests failed. Fix the logic." 1>&2
#     exit 2
# fi

exit 0