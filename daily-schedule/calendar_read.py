#!/usr/bin/env python3
# Helper: query Apple Calendar for events between two dates (YYYY-MM-DD)
import subprocess, sys
start = sys.argv[1]
end = sys.argv[2]
script = f'''
set startDate to date "{start}"
set endDate to date "{end}"
set outLines to {{}}

tell application "Calendar"
    repeat with cal in calendars
        set calName to name of cal
        try
            set evs to (every event of cal whose start date ≥ startDate and start date ≤ endDate)
        on error
            set evs to {{}}
        end try
        repeat with e in evs
            try
                set sDate to start date of e
            on error
                set sDate to missing value
            end try
            if sDate is not missing value then
                set sStr to (sDate as string)
                try
                    set tStr to summary of e
                on error
                    set tStr to ""
                end try
                try
                    set loc to location of e
                    if loc is missing value then set loc to ""
                on error
                    set loc to ""
                end try
                set end of outLines to (calName & "||" & sStr & "||" & tStr & "||" & loc)
            end if
        end repeat
    end repeat
end tell
if (count of outLines) is 0 then
    return "[알림] 일정이 없습니다."
else
    set AppleScript's text item delimiters to "\n"
    set joined to outLines as string
    return joined
end if
'''
proc = subprocess.run(['osascript','-e', script], capture_output=True, text=True)
print(proc.stdout.strip())
