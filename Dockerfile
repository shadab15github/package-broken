# Deliberately outdated / misconfigured base image for scanner testing.
FROM node:14.15.0-buster

WORKDIR /app

# runs as root, no non-root user
COPY package.json package-lock.json ./
RUN npm install --unsafe-perm --legacy-peer-deps

COPY . .

# secrets baked into the image layer
ENV JWT_SECRET=hardcoded-dev-secret-do-not-use
ENV DB_PASSWORD=root123
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN chmod -R 777 /app

RUN npm run build || true

EXPOSE 3000

CMD ["npm", "start"]
