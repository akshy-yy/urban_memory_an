#!/bin/bash
echo "=================================================="
echo "  Starting Urban Infrastructure Memory System"
echo "=================================================="

DIR=$(pwd)

echo "[1/3] Starting Spring Boot Backend API..."
osascript -e "tell app \"Terminal\" to do script \"cd '$DIR/backend' && ./mvnw spring-boot:run\""

echo "[2/3] Starting Official Portal (Frontend)..."
osascript -e "tell app \"Terminal\" to do script \"cd '$DIR/frontend' && npm run dev\""

echo "[3/3] Starting Citizen Portal..."
osascript -e "tell app \"Terminal\" to do script \"cd '$DIR/citizen-portal' && npm run dev -- --port 5174\""
