#!/bin/bash
set -x

# Assuming your TypeScript application is running as a Node.js service.
# You might need to customize this based on how your application is started.

# Find the process ID (PID) of your TypeScript application
typescript_pid=$(pgrep -f "start.js")

if [ -n "$typescript_pid" ]; then
    # If the PID is not empty, it means the process is running, so stop it.
    kill "$typescript_pid"
fi