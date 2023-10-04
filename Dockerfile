FROM node:16
COPY ["package.json", "yarn.lock", "/usr/docker/"]
WORKDIR /usr/docker
RUN yarn install
COPY [".", "/usr/docker/"]
EXPOSE 4000
CMD ["npm", "run", "start:dev"]
