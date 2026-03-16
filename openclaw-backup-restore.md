# OpenClaw Backup / Restore

## Current backup location
- `/Users/jamie/.openclaw/backups/2026-03-12T12-36-17.165Z-openclaw-backup.tar.gz`

## Create a new full backup
```bash
openclaw backup create
```

## Verify a backup archive
```bash
openclaw backup verify /path/to/openclaw-backup.tar.gz
```

## Suggested restore procedure
1. Stop the gateway/service before restore.
2. Move the current `~/.openclaw` out of the way for safety.
3. Extract the archive to a temporary directory first.
4. Inspect contents.
5. Replace `~/.openclaw` with the restored copy.
6. Start the gateway again and verify with `openclaw status`.

## Example restore flow
```bash
openclaw gateway stop
mv ~/.openclaw ~/.openclaw.pre-restore.$(date +%Y%m%d-%H%M%S)
mkdir -p /tmp/openclaw-restore
cd /tmp/openclaw-restore
tar -xzf /path/to/openclaw-backup.tar.gz
# inspect extracted files, then restore the .openclaw tree to your home directory
openclaw gateway start
openclaw status
```

## Notes
- The backup created on 2026-03-12 was verified successfully.
- In this environment, the workspace lives under `~/.openclaw/workspace`, so a full `~/.openclaw` backup already includes the workspace.
- Prefer verifying every newly created archive.
