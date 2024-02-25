FROM node:21-alpine
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm ci --omit dev
ADD build/ build/
ENV BODY_SIZE_LIMIT=0
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
ENV ORIGIN=https://narreddit.com
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "-c", "node -r dotenv/config build"]
