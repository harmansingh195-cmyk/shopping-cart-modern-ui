#!/usr/bin/env python3
"""
preToolUse hook (matcher: "create|edit")

Checks SDLC document prerequisites based ONLY on the target file path.

"""

import json
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
    result = {
        "permissionDecision": decision
    }

    if reason:
        result["permissionDecisionReason"] = reason

    print(json.dumps(result))
    sys.exit(0)


def find_target_path(tool_args):
    """
    Extract the target file path from known path-related fields only.

    Never search arbitrary serialized tool arguments because that could
    accidentally match paths contained inside the file content.
    """

    if not isinstance(tool_args, dict):
        return None

    path_keys = {
        "path",
        "filePath",
        "file_path",
        "targetPath",
        "target_path",
        "filename",
        "fileName",
        "file_name",
        "destination",
        "destinationPath",
        "destination_path",
    }

    def search(value):
        if isinstance(value, dict):
            for key, child in value.items():
                if key in path_keys and isinstance(child, str):
                    return child

                result = search(child)
                if result:
                    return result

        elif isinstance(value, list):
            for item in value:
                result = search(item)
                if result:
                    return result

        return None

    return search(tool_args)


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        # Fail open if the hook payload cannot be parsed.
        emit("allow")
        return

    cwd = payload.get("cwd") or "."

    tool_args = payload.get(
        "toolArgs",
        payload.get("tool_input", {})
    )

    # IMPORTANT:
    # Only inspect the actual target path.
    target_path = find_target_path(tool_args)

    if not target_path:
        emit("allow")
        return

    # Normalize Windows paths.
    normalized = target_path.replace("\\", "/")

    # Only apply this hook to src/docs/*.md.
    if not normalized.startswith("src/docs/"):
        emit("allow")
        return

    if not normalized.lower().endswith(".md"):
        emit("allow")
        return

    target = Path(normalized).name

    # requirements.md has no prerequisite.
    # Therefore it is always allowed.
    required = DOC_PRECONDITIONS.get(target)

    if not required:
        emit("allow")
        return

    docs_dir = Path(cwd) / "src" / "docs"

    # ONLY check file existence.
    missing = [
        document
        for document in required
        if not (docs_dir / document).is_file()
    ]

    if missing:
        missing_paths = ", ".join(
            f"src/docs/{document}"
            for document in missing
        )

        emit(
            "deny",
            f"Blocked by SDLC phase gate: cannot write "
            f"src/docs/{target} because the required document(s) "
            f"do not exist: {missing_paths}. "
            f"Run the earlier SDLC phase(s) first."
        )

        return

    emit("allow")


if __name__ == "__main__":
    main()