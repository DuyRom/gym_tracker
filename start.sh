#!/bin/bash
set -e

# ==============================================================================
# start.sh — Gym Tracker (FIT) Service Management Script
# ==============================================================================

show_help() {
  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        Gym Tracker (FIT) — Docker Management CLI             ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
  echo "USAGE:"
  echo "  ./start.sh <environment> <command> [options]"
  echo "  ./start.sh help"
  echo ""
  echo "ENVIRONMENTS:"
  echo "  common    Common server (behind shared reverse proxy on proxy-net)"
  echo "  prod      Standalone production server"
  echo "  build     Build the custom Docker image and push to Docker Hub"
  echo ""
  echo "COMMANDS:"
  echo "  up -d             Start all services in detached mode"
  echo "  down              Stop and remove containers"
  echo "  logs -f           Follow live logs for all services"
  echo "  ps                Show status of running containers"
  echo "  db:push           Run prisma db push inside the app container"
  echo "  db:seed           Run database seed inside the app container"
  echo ""
  echo "EXAMPLES:"
  echo "  ./start.sh common up -d          # Start behind shared reverse proxy"
  echo "  ./start.sh build                 # Build image and push using tag from .env"
  echo "  ./start.sh build 1.0.0           # Build and push with explicit tag"
  echo "  ./start.sh common logs -f        # View live logs"
  echo "  ./start.sh common db:push        # Push prisma schema to MariaDB"
  echo ""
}

if [ "$1" == "help" ] || [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  show_help
  exit 0
fi

if [ -z "$1" ]; then
  echo "Usage: ./start.sh <environment> <command> [options]"
  echo "       ./start.sh help    — show full command reference"
  exit 1
fi

COMPOSE_FILES="-f compose.yml"

if [[ "$1" == "build" ]]; then
  echo "🚀 Mode: BUILD & PUSH IMAGE"
  # Get tag from 2nd argument, or .env file (default to latest)
  TAG="$2"
  if [ -z "$TAG" ] && [ -f .env ]; then
    TAG=$(grep -E '^FIT_IMAGE_TAG=' .env | cut -d '=' -f 2 | tr -d '"' | tr -d "'" | tr -d '\r')
  fi
  if [ -z "$TAG" ]; then
    TAG="latest"
    echo "⚠️  FIT_IMAGE_TAG not found, defaulting to 'latest'"
  else
    echo "📦 Using image tag: $TAG"
  fi
  
  echo "🔨 Building image odbadmin/fit:$TAG and odbadmin/fit:latest..."
  docker build -t odbadmin/fit:$TAG -t odbadmin/fit:latest -f Dockerfile .
  
  echo "⬆️ Pushing images to Docker Hub..."
  docker push odbadmin/fit:$TAG
  if [ "$TAG" != "latest" ]; then
    docker push odbadmin/fit:latest
  fi
  
  echo "✅ Build & Push completed successfully!"
  exit 0
elif [[ "$1" == "prod" ]]; then
  echo "🚀 Mode: PRODUCTION (Standalone)"
  COMPOSE_FILES="$COMPOSE_FILES -f prod.yml"
  shift
elif [[ "$1" == "common" ]]; then
  echo "🚀 Mode: COMMON (Reverse Proxy - proxy-net)"
  COMPOSE_FILES="$COMPOSE_FILES -f common.yml"
  shift
else
  echo "⚠️  Unknown environment: $1. Defaulting to standard compose.yml"
  shift
fi

if [[ "$1" == "db:push" ]]; then
  echo "🔄 Running Prisma db push inside app container..."
  docker compose $COMPOSE_FILES exec app npx --no-install prisma db push
  exit 0
elif [[ "$1" == "db:seed" ]]; then
  echo "🌱 Running Prisma db seed inside app container..."
  docker compose $COMPOSE_FILES exec app npx --no-install prisma db seed
  exit 0
fi

if [ -z "$1" ]; then
  set -- "up" "-d"
fi

echo "▶️  Executing: docker compose $COMPOSE_FILES $@"
docker compose $COMPOSE_FILES "$@"
echo "✅ Command executed successfully"
