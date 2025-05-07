FROM node:hydrogen-alpine

# Create app directory
COPY ./ /app
WORKDIR /app

# Install app dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]

