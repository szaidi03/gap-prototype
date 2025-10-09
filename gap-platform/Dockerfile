# ---------- Stage 1: Build Angular app ----------
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build it
COPY . .
RUN npm run build --prod

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy built app to Nginx HTML directory
COPY --from=build /app/dist/gap-platform /usr/share/nginx/html

# Expose port 80 for web access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
