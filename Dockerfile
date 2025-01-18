FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire src directory
COPY src/ ./src/

# Copy other necessary files
COPY . .

# Start the application
CMD ["npm", "start"]