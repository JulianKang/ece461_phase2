#!/bin/bash
set -xe

cd /home/ubuntu/apps/ece461_phase2

# Start serve with the obtained public IP and desired port
pm2 start dist/server/server.js
sudo service nginx restart