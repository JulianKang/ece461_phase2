#!/bin/bash
set -xe

cd /home/ubuntu/apps

# Start serve with the obtained public IP and desired port
pm2 start dist/server/start_server.js
service nginx restart
echo "complete"