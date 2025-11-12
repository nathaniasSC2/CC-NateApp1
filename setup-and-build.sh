#!/bin/bash

echo "==================================="
echo "NFL Dashboard - Quick Setup"
echo "==================================="
echo ""

echo "[1/3] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js: OK"
node --version
echo ""

echo "[2/3] Installing dependencies..."
echo "This may take a few minutes..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies: OK"
echo ""

echo "[3/3] Building application..."
echo "This will take 2-5 minutes..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi
echo ""

echo "==================================="
echo "BUILD COMPLETE!"
echo "==================================="
echo ""
echo "Your app is ready in: release/"
echo ""
echo "To run the app:"
echo "  Linux: ./release/*.AppImage"
echo "  macOS: open release/*.dmg"
echo ""
echo "Or run in dev mode: npm run electron:dev"
echo ""
