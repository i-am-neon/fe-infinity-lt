# Set default shell
set shell := ["bash", "-c"]

# Start both the client and server
start:
    just start-server & just start-client

# Start the Deno server with Conda
start-server:
    cd server && source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && deno task server

# Run the LT editor
editor:
    cd lt-maker-fork && source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && wine python run_editor.py

# Start the Next.js client
start-client:
    cd client && pnpm dev

# Stop all running processes
stop:
    pkill -f "deno|pnpm dev"

clean:
    just stop
    find lt-maker-fork -maxdepth 1 -type d -name "*.ltproj" ! -name "default.ltproj" -exec rm -rf {} +
    rm -f server/db/local.db
    deno run --allow-all server/game-engine-io/clean-saves.ts

# Run a script in the server directory, passing in the relative path from the root directory
run path:
    source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && deno run --allow-all --config server/deno.json "{{path}}"