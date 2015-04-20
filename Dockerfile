FROM node
EXPOSE 9001
ADD ./ /source
RUN cd /source && npm install
CMD node /source/server.js

