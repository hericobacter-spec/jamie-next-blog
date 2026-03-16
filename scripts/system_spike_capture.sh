#!/usr/bin/env bash
# system_spike_capture.sh
# Run in background (nohup) to monitor load and capture ps/top logs when load spikes.
THRESHOLD=4.0
SAMPLES=3
INTERVAL=10
OUTDIR=/tmp/system-spikes
mkdir -p "$OUTDIR"
while true; do
  # get 1m load
  LOAD=$(uptime | awk -F'load averages?: ' '{print $2}' | awk -F', ' '{print $1}' | tr -d ',')
  # fallback parsing
  if [ -z "$LOAD" ]; then
    LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk -F', ' '{print $1}' | tr -d ',') || true
  fi
  # compare float
  perl -e "exit( ($LOAD > $THRESHOLD) ? 0 : 1 )"
  if [ $? -eq 0 ]; then
    ts=$(date +%Y%m%d-%H%M%S)
    outfile="$OUTDIR/spike-$ts.log"
    echo "=== Spike captured at $ts (load=$LOAD) ===" > "$outfile"
    for i in $(seq 1 $SAMPLES); do
      echo "--- top sample $i ---" >> "$outfile"
      top -l 1 -n 0 | head -n 80 >> "$outfile" 2>&1
      echo "--- ps aux (sorted) ---" >> "$outfile"
      ps aux --sort=-%cpu | head -n 60 >> "$outfile" 2>&1
      sleep $INTERVAL
    done
    # keep a short index
    ls -1t $OUTDIR | sed -n '1,20p' > "$OUTDIR/index.txt"
  fi
  sleep 5
done
