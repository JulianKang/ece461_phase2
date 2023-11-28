#!/bin/bash
set -x
# Log file path
log_file="/home/ubuntu/pm2.logs"

# Log environment variables
env >> "$log_file"

# Navigate to the application directory
cd /home/ubuntu/apps

# Get the number of online processes without a newline
online_processes=$(pm2 list | grep -c 'online')

# Check if there are any online processes
if [ "$online_processes" -gt 0 ]; then
    # Stop PM2 processes and capture output to log file
    pm2 stop all >> "$log_file" 2>&1
    pm2 delete all >> "$log_file" 2>&1
else
    echo "No online processes to stop and delete." >> "$log_file"
fi
echo "complete"