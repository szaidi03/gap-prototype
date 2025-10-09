# ---------- Stage 1: Build Angular app ----------
FROM node:18 AS build
WORKDIR /app

# Install Angular CLI and dependencies
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

# Copy the full source code
COPY . .

# Build the Angular app
RUN npx ng build gap-platform --configuration production

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy the built output (correct subpath)
COPY --from=build /app/dist/gap-platform/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
