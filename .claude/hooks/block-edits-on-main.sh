#!/usr/bin/env bash
# PreToolUse hook: deny Edit/Write/MultiEdit/NotebookEdit while on the default
# branch, to enforce the branch-then-PR workflow (see CLAUDE.md > Git Workflow).
# Reads the hook payload on stdin (unused); decides purely from the git branch.
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
case "$branch" in
  main|master)
    printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"On protected branch %s. Create a feature branch first (git checkout -b feat/<description>), make the change there, then open a PR."}}\n' "$branch"
    ;;
esac
