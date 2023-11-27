#!/bin/bash
set -x

# Assuming your TypeScript application is running as a Node.js service.
# You might need to customize this based on how your application is started.

# Find the process ID (PID) of your TypeScript application
pm2 stop all
pm2 delete all