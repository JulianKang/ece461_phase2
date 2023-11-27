#!/bin/bash
set -xe

# Delete the old  directory as needed.

if [ -d /usr/local/project-code ]; then
    rm -rf /home/ubuntu/apps
fi
if [ -d /usr/local/project-code ]; then
    rm -rf /var/www/build
fi
mkdir -vp /var/www/build
mkdir -vp /home/ubuntu/apps