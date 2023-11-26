#!/bin/bash
set -xe

cd ~/project-code
npm install
npm run build
npm install -g serve
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Start serve with the obtained public IP and desired port
cd build
serve -s -l "${EC2_PUBLIC_IP}:80"