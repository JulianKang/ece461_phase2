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
npm install adm-zip@^0.5.10 body-parser@^1.20.2 Buffer@^0.0.0 chai-as-promised@^7.1.1 express@^4.18.2 express-async-errors@^3.1.1 fs-extra@^11.1.1 mysql2@^3.6.2 nyc@^15.1.0 @testing-library/user-event@^13.5.0 @types/chai@^4.3.6 @types/express@^4.17.20 @types/fs-extra@^11.0.4 @types/node@^20.6.2 @types/proxyquire@^1.3.29 @types/sinon@^10.0.16 @types/supertest@^2.0.15 axios@^1.5.1 chai@^4.3.8 dotenv@^16.3.1 mocha@^10.2.0 proxyquire@^2.1.3 simple-git@^3.20.0 sinon@^16.0.0 supertest@^6.3.3 ts-jest@^29.1.1 typescript@^5.2.2 web-vitals@^2.1.4 winston@^3.11.0
scp -r build/* /var/www/build
scp /home/ubuntu/environment-files/.env ./
sudo apt-get clean
sudo npm cache clean --force
sudo rm -rf /usr/lib/node_modules/pm2
sudo npm install -g pm2
tsc
echo "complete"