# Use a minimal Node.js image
FROM node:18-alpine

# Install FFmpeg
# RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Install FFmpeg using apk
RUN apk add --no-cache ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the application source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Remove devDependencies for a smaller production image
RUN npm prune --production

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
