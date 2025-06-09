# PowerShell helper script for Docker operations

param (
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Service,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$ExtraArgs
)

function Show-Help {
    Write-Host "Wove Docker Helper"
    Write-Host "Usage: .\docker.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  up        - Start all containers"
    Write-Host "  up-d      - Start all containers in detached mode"
    Write-Host "  down      - Stop and remove all containers"
    Write-Host "  build     - Build all images"
    Write-Host "  rebuild   - Rebuild all images from scratch"
    Write-Host "  ps        - List running containers"
    Write-Host "  logs      - Show logs for all or specified service"
    Write-Host "  exec      - Execute command in a service container"
}

switch ($Command) {
    "up" {
        Write-Host "Starting all containers..."
        docker-compose up
    }
    "up-d" {
        Write-Host "Starting all containers in detached mode..."
        docker-compose up -d
    }
    "down" {
        Write-Host "Stopping and removing all containers..."
        docker-compose down
    }
    "build" {
        Write-Host "Building all images..."
        docker-compose build
    }
    "rebuild" {
        Write-Host "Rebuilding all images..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up
    }
    "ps" {
        Write-Host "Listing running containers..."
        docker-compose ps
    }
    "logs" {
        if ([string]::IsNullOrEmpty($Service)) {
            Write-Host "Showing logs for all services..."
            docker-compose logs -f
        } else {
            Write-Host "Showing logs for $Service service..."
            docker-compose logs -f $Service
        }
    }
    "exec" {
        if ([string]::IsNullOrEmpty($Service)) {
            Write-Host "Error: Service name is required" -ForegroundColor Red
            Write-Host "Usage: .\docker.ps1 exec [service] [command]"
            exit 1
        }
        
        if ($ExtraArgs.Count -eq 0) {
            Write-Host "Executing shell in $Service service..."
            docker-compose exec $Service sh
        } else {
            $cmdArgs = $ExtraArgs -join " "
            Write-Host "Executing command in $Service service: $cmdArgs"
            docker-compose exec $Service $ExtraArgs
        }
    }
    default {
        Show-Help
    }
}