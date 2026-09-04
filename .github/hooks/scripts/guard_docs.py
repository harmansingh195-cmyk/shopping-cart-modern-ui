#!/usr/bin/env python3
"""
preToolUse hook (matcher: "create|edit")

Technical backstop for the SDLC "one phase at a time" rule. Before a phase
agent is allowed to create/edit one of the later SDLC artifacts, this
confirms the artifact(s) from the required earlier phase already exist on
disk. Phase agents already carry this rule in their own instructions; this
hook makes it non-optional in case an agent is invoked out of order,
directly by name, or by a future automation that skips the orchestrator.

Only targets files under src/docs/*.md; every other create/edit call
(source code, tests, etc.) is left untouched.
"""
import json
import re
import sys
from pathlib import Path

DOC_PRECONDITIONS = {
    "architecture.md": ["requirements.md"],
    "design-review.md": ["architecture.md"],
    "impl-plan.md": ["architecture.md"],
    "review-report.md": ["verification-report.md"],
    "pr-description.md": ["review-report.md"],
}

def emit(decision, reason=None):
    out = {"permissionDecision": decision}
    if reason:
        out["permissionDecisionReason"] = reason
    print(json.dumps(out))
    sys.exit(0)

def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        emit("allow")
        return

    cwd = payload.get("cwd") or "."
    tool_args = payload.get("toolArgs", payload.get("tool_input", {}))
    # The exact key holding the destination path varies by client, so search
    # the whole serialized args for a src/docs/*.md reference instead of
    # depending on one field name.
    blob = json.dumps(tool_args) if not isinstance(tool_args, str) else tool_args
    match = re.search(r"src[/\\]docs[/\\]([A-Za-z0-9_.-]+\.md)", blob)
    if not match:
        emit("allow")
        return

    target = match.group(1)
    required = DOC_PRECONDITIONS.get(target)
    if not required:
        emit("allow")
        return

    docs_dir = Path(cwd) / "src" / "docs"
    missing = [r for r in required if not (docs_dir / r).exists()]
    if missing:
        emit(
            "deny",
            f"src/docs/{target} until {', '.join('src/docs/' + m for m in missing)} "
            f"Do not exist. Run the earlier SDLC phase(s) first.",
        )
        return

    emit("allow")

if __name__ == "__main__":
    main()
