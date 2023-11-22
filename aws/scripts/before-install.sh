#!/bin/bash
set -xe

# Delete the old  directory as needed.
if [ -d /usr/local/codedeployresources ]; then
    rm -rf /usr/local/codedeployresources/
fi

if [ -d /usr/local/project-code ]; then
    rm -rf /usr/local/project-code/
fi

mkdir -vp /usr/local/codedeployresources
mkdir -vp /usr/local/project-code