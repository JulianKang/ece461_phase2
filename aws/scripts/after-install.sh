#!/bin/bash
set -xe

# Set your S3 bucket and folder path
S3_BUCKET="ece461project-webappdeploymentbucket-2lx7q4y0g218"
S3_FOLDER="project-code/"

# Set your destination folder
DESTINATION_FOLDER="/usr/local/project-code"

# Copy the entire GitHub repository code from S3 to the local folder
aws s3 sync s3://$S3_BUCKET/$S3_FOLDER $DESTINATION_FOLDER

cd /usr/local/project-code

npm install