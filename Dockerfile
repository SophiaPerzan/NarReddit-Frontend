FROM node:21-alpine
WORKDIR /app
ADD package.json .
ADD package-lock.json .
RUN npm ci --omit dev
ADD build/ build/
ENV BODY_SIZE_LIMIT=0
ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host
EXPOSE 3000
ENTRYPOINT ["/bin/sh", "-c", "ORIGIN=https://narreddit.com node -r dotenv/config build"]
