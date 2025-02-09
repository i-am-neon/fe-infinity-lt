# Set default shell
set shell := ["bash", "-c"]

# Start both the client and server
start:
    just start-server & just start-client & just init-pgvector

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
    just stop-pgvector

clean:
    just stop
    find lt-maker-fork -maxdepth 1 -type d -name "*.ltproj" ! -name "default.ltproj" -exec rm -rf {} +
    rm -f server/db/local.db
    deno run --allow-all server/game-engine-io/clean-saves.ts

# Run a script in the server directory, passing in the relative path from the root directory
run path:
    source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && cd server && set -a; source .env; set +a; cd .. && deno run --allow-all --config server/deno.json "{{path}}"

process-maps:
    just run server/map-processing/process-all-maps.ts

process-portraits:
    just run server/portrait-processing/process-all-portraits.ts

# Initialize PostgreSQL with pgvector extension installed and configured.
init-pgvector:
	brew install pgvector || true
	brew services restart postgresql@14
	just run server/vector-db/seed-vectors.ts

stop-pgvector:
    brew services stop postgresql@14