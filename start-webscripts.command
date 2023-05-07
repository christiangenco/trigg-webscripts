#!/bin/bash
cd "$(dirname "$0")"

echo "Updating"
git pull

echo "Building"
BUILD_PATH=./server/build npm run build

echo "Running (ctrl+C to exit)"
/usr/local/bin/node server/server.js
