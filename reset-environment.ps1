# Function to stop processes by name pattern
function Stop-ProcessByPattern {
    param([string]$Pattern)
    Get-Process | Where-Object {$_.CommandLine -like "*$Pattern*"} | Stop-Process -Force -ErrorAction SilentlyContinue
}

# Equivalent to "just stop"
function Stop-All {
    # Stop the processes
    Stop-ProcessByPattern "deno"
    Stop-ProcessByPattern "pnpm dev"
    Stop-ProcessByPattern "vite"
    Stop-ProcessByPattern "vector-db"
}

# Equivalent to "just clean-logs"
function Clean-Logs {
    Remove-Item -Path "server\_logs\*" -Recurse -Force -ErrorAction SilentlyContinue
}

# Equivalent to "just clean-saves"
function Clean-Saves {
    deno run --allow-all server/game-engine-io/clean-saves.ts
}

# Equivalent to "just clean"
function Clean-All {
    Stop-All
    
    # Remove project directories except default and testing
    Get-ChildItem -Path "lt-maker-fork" -Directory -Filter "*.ltproj" | 
    Where-Object {$_.Name -ne "default.ltproj" -and $_.Name -ne "testing_proj.ltproj"} | 
    Remove-Item -Recurse -Force
    
    # Remove sqlite db
    Remove-Item -Path "server\db\sqlite.db" -Force -ErrorAction SilentlyContinue
    
    # Clean logs and saves
    Clean-Logs
    Clean-Saves
}

# Equivalent to "just reset"
function Reset-Environment {
    Stop-All
    Clean-All
}

# Run the reset function
Reset-Environment 