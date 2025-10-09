# ---------- Stage 1: Build Angular app ----------
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Angular app (creates /app/dist/<project-name>)
RUN ng build --configuration production

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy built Angular files to Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
