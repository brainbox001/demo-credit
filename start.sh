#!/bin/bash

# Print a message to confirm the script started
echo "Starting the setup process..."

npm install
npx tsc
npm run migrate
npm run test
npm start

# Indicate the script finished
echo "Setup complete."
