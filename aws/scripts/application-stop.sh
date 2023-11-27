#!/bin/bash

# Assuming your TypeScript application is running as a Node.js service.
# You might need to customize this based on how your application is started.

# Find the process ID (PID) of your TypeScript application
#!/bin/bash

# Log file path
log_file="/home/ubuntu/pm2.logs"

# Log environment variables
env >> "$log_file"

# Navigate to the application directory
cd /home/ubuntu/apps/ece461_phase2

# Stop PM2 processes and capture output to log file
pm2 stop all >> "$log_file" 2>&1
pm2 delete all >> "$log_file" 2>&1