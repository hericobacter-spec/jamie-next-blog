#!/usr/bin/env bash
set -euo pipefail

SRC="/Users/jamie/.openclaw/workspace"
DEST_BASE="/Users/jamie/NetworkDrives/SUPER-personal_folder/Backups/openclaw-workspace-md"
DEST_LATEST="$DEST_BASE/latest"
DEST_SNAP_DIR="$DEST_BASE/snapshots"

TS=$(date +"%Y-%m-%d_%H%M%S")
DEST_SNAP="$DEST_SNAP_DIR/$TS"

log(){ echo "[$(date +"%F %T")] $*"; }

# 0) Preconditions
if [ ! -d "$SRC" ]; then
  log "ERROR: source missing: $SRC" >&2
  exit 2
fi
if [ ! -d "/Users/jamie/NetworkDrives/SUPER-personal_folder" ]; then
  log "ERROR: NAS not mounted (missing /Users/jamie/NetworkDrives/SUPER-personal_folder)" >&2
  exit 3
fi

mkdir -p "$DEST_LATEST" "$DEST_SNAP_DIR"

# 1) Find most recent snapshot for hardlink-dedup
PREV=$(ls -1 "$DEST_SNAP_DIR" 2>/dev/null | tail -n 1 || true)
LINK_DEST_ARGS=()
if [ -n "$PREV" ] && [ -d "$DEST_SNAP_DIR/$PREV" ]; then
  LINK_DEST_ARGS=("--link-dest=$DEST_SNAP_DIR/$PREV")
fi

# 2) Create snapshot (hardlink unchanged files)
log "Backup snapshot -> $DEST_SNAP"
mkdir -p "$DEST_SNAP"

# Copy ONLY *.md while keeping folder structure
# Notes:
# - include */ is required so rsync traverses directories
# - prune-empty-dirs removes empty dirs created by include rules
rsync -a --delete --prune-empty-dirs \
  ${LINK_DEST_ARGS[@]+"${LINK_DEST_ARGS[@]}"} \
  --include='*/' \
  --include='*.md' \
  --exclude='*' \
  "$SRC/" "$DEST_SNAP/"

# 3) Update latest mirror to point to snapshot contents (fast mirror)
log "Update latest mirror -> $DEST_LATEST"
rsync -a --delete --prune-empty-dirs \
  --include='*/' \
  --include='*.md' \
  --exclude='*' \
  "$DEST_SNAP/" "$DEST_LATEST/"

# 4) Optional retention (keep last 30 snapshots)
KEEP=${KEEP_SNAPSHOTS:-30}
COUNT=$(ls -1 "$DEST_SNAP_DIR" 2>/dev/null | wc -l | tr -d ' ')
if [ "$COUNT" -gt "$KEEP" ]; then
  TO_DELETE=$((COUNT-KEEP))
  log "Retention: removing $TO_DELETE old snapshots (keep=$KEEP)"
  ls -1 "$DEST_SNAP_DIR" | head -n "$TO_DELETE" | while read -r d; do
    [ -n "$d" ] && rm -rf "$DEST_SNAP_DIR/$d"
  done
fi

log "OK"
