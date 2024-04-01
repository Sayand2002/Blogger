FROM node:18-alpine
WORKDIR /Blogger
COPY . .
RUN yarn install --production
CMD ["node", "index.js"]
EXPOSE 2000

