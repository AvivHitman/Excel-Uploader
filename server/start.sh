#!/bin/bash

# Enable debugging mode to print each command before executing it
set -x

# Install dependencies
npm install

npm i @swc-node/register

# Start the application with nodemon
exec nodemon --inspect=0.0.0.0 --exec node -r @swc-node/register src/main.ts
