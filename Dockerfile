FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm install && cd public && npm install

EXPOSE 8080
CMD [ "npm", "start" ]