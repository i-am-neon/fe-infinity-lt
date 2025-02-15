# Set default shell
set shell := ["bash", "-c"]

# Start both the client and server
start:
    just start-vector-db
    just start-server & # start server and client in parallel
    just start-client

# Start the Deno server with Conda
start-server:
    cd server && source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && deno task server

# Run the LT editor
editor:
    cd lt-maker-fork
    source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh
    conda activate fe-i-lt
    wine python run_editor.py

# Start the Next.js client
start-client:
    cd client && pnpm dev

reset:
    just stop
    just clean

# Stop all running processes
stop:
	-pkill -f "deno"
	-pkill -f "pnpm dev"
	-pkill -f "next dev"
	just stop-vector-db

clean:
    just stop
    find lt-maker-fork -maxdepth 1 -type d -name "*.ltproj" ! -name "default.ltproj" ! -name "testing_proj.ltproj" -exec rm -rf {} +
    rm -f server/db/local.db
    just clean-logs
    deno run --allow-all server/game-engine-io/clean-saves.ts

clean-logs:
    rm -rf server/logs/*
# Run a script in the server directory, passing in the relative path from the root directory
run path:
    source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && cd server && set -a; source .env; set +a; cd .. && deno run --allow-all --config server/deno.json "{{path}}"

process-maps:
    rm -rf server/vector-db/seed-vectors/maps.json
    just run server/map-processing/process-all-maps.ts

process-portraits:
    rm -rf server/vector-db/seed-vectors/portraits.json
    just run server/portrait-processing/process-all-portraits.ts

process-music:
    rm -rf server/vector-db/seed-vectors/music.json
    just run server/music-processing/convert-mp3-to-ogg.ts
    just run server/music-processing/process-all-music.ts

# Initialize PostgreSQL with pgvector extension installed and configured.
start-vector-db:
	brew install pgvector || true
	brew services restart postgresql@14
	just run server/vector-db/init.ts
	just run server/vector-db/seed-vectors.ts

stop-vector-db:
    brew services stop postgresql@14