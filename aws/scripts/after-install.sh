#!/bin/bash
set -xe

# Set your S3 bucket and folder path
S3_BUCKET="ece461project2-webappdeploymentbucket-1kv8j892axxhq"
S3_FOLDER="project-code/"

# Set your destination folder
DESTINATION_FOLDER="~/project-code"

# Copy the entire GitHub repository code from S3 to the local folder
#aws s3 sync s3://$S3_BUCKET/$S3_FOLDER $DESTINATION_FOLDER

cd /home/ubuntu/apps
sudo apt-get clean
sudo npm cache clean --force
npm install --omit="@types/react,@types/react-dom,react,react-dom,react-router-dom,react-scripts"
scp -r build/* /var/www/build
scp /home/ubuntu/environment-files/.env ./
sudo apt-get clean
sudo npm cache clean --force
sudo rm -rf /usr/lib/node_modules/pm2
sudo npm install -g pm2
tsc
echo "complete"