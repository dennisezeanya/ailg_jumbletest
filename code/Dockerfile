# Use explicit and deterministic Docker base image tags
FROM node:18-alpine

# 
LABEL Maintainer="dennisezeanya"
LABEL version="0.1.0"

# Create app directory
WORKDIR /home/node/app

# Copy both package.json AND package-lock.json
COPY package*.json ./

RUN npm ci 

# Copy source code
COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]