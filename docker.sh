#!/bin/bash

# Helper script for Docker operations

case "$1" in
  up)
    echo "Starting all containers..."
    docker-compose up
    ;;
  up-d)
    echo "Starting all containers in detached mode..."
    docker-compose up -d
    ;;
  down)
    echo "Stopping and removing all containers..."
    docker-compose down
    ;;
  build)
    echo "Building all images..."
    docker-compose build
    ;;
  rebuild)
    echo "Rebuilding all images..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up
    ;;
  ps)
    echo "Listing running containers..."
    docker-compose ps
    ;;
  logs)
    if [ -z "$2" ]; then
      echo "Showing logs for all services..."
      docker-compose logs -f
    else
      echo "Showing logs for $2 service..."
      docker-compose logs -f "$2"
    fi
    ;;
  exec)
    if [ -z "$2" ]; then
      echo "Error: Service name is required"
      echo "Usage: ./docker.sh exec [service] [command]"
      exit 1
    fi
    
    if [ -z "$3" ]; then
      echo "Executing shell in $2 service..."
      docker-compose exec "$2" sh
    else
      shift 2
      echo "Executing command in $1 service: $@"
      docker-compose exec "$1" "$@"
    fi
    ;;
  *)
    echo "Wove Docker Helper"
    echo "Usage: ./docker.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up        - Start all containers"
    echo "  up-d      - Start all containers in detached mode"
    echo "  down      - Stop and remove all containers"
    echo "  build     - Build all images"
    echo "  rebuild   - Rebuild all images from scratch"
    echo "  ps        - List running containers"
    echo "  logs      - Show logs for all or specified service"
    echo "  exec      - Execute command in a service container"
    ;;
esac