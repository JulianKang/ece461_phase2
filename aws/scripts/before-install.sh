#!/bin/bash
set -xe

# Delete the old  directory as needed.

if [ -d /home/ubuntu/apps ]; then
    sudo rm -rf /home/ubuntu/apps
fi
if [ -d /var/www/build ]; then
    sudo rm -rf /var/www/build
fi
mkdir -vp /var/www/build
mkdir -vp /home/ubuntu/apps
echo "complete"