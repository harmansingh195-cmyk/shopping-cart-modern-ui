#!/bin/bash

# Resolve the repo root
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

FILES=(
    "requirements.md"
    "architecture.md"
    "design-review.md"
    "impl-plan.md"
    "verification-report.md"
)

MISSING=()

for file in "${FILES[@]}"; do
    found=false
    
    # Check root directory
    if [ -f "$REPO_ROOT/$file" ]; then
        found=true
    fi
    
    # Check docs directory
    if [ -f "$REPO_ROOT/docs/$file" ]; then
        found=true
    fi
    

    
    if [ "$found" = false ]; then
        MISSING+=("$file")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    for file in "${MISSING[@]}"; do
        echo "ERROR: $file is missing" >&2
    done
    exit 1
fi

echo "PR readiness check passed"
exit 0