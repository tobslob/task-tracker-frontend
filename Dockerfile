# Stage 1: Build the React app
FROM node:20-alpine AS builder

# Accept env var from Render at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

# Inject build-time env var into .env.production for CRA to pick up
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env.production

# Build the React app
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Clean out default NGINX HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy build from previous stage
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
