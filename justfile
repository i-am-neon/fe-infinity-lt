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
    cd lt-maker-fork && source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && wine python run_editor.py

# Start the Vite React client
start-client:
    cd client && pnpm dev

reset:
    just stop
    just clean

# Stop all running processes
stop:
	-pkill -f "deno"
	-pkill -f "pnpm dev"
	-pkill -f "vite"
	just stop-vector-db

clean:
    just stop
    find lt-maker-fork -maxdepth 1 -type d -name "*.ltproj" ! -name "default.ltproj" ! -name "testing_proj.ltproj" -exec rm -rf {} +
    rm -f server/db/sqlite.db
    just clean-logs
    just clean-saves

clean-saves:
    deno run --allow-all server/game-engine-io/clean-saves.ts

clean-logs:
    rm -rf server/_logs/*
# Run a script in the server directory, passing in the relative path from the root directory
run path:
    source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && cd server && set -a; source .env; set +a; cd .. && deno run --allow-all --config server/deno.json "{{path}}"

###################
# Vector DB
###################
start-vector-db:
	just run server/vector-db/init.ts
	just run server/vector-db/seed-vectors.ts

stop-vector-db:
	-pkill -f "vector-db"

###################
# Asset Processing
###################

# Make sure the vector db is running before processing assets!

process-maps:
    rm -rf server/vector-db/seed-data/maps.json
    rm -rf server/vector-db/data/maps.json
    just run server/map-processing/process-all-maps.ts
    just start-vector-db

process-portraits:
    rm -rf server/vector-db/seed-data/portraits-male.json
    rm -rf server/vector-db/data/portraits-male.json
    rm -rf server/vector-db/seed-data/portraits-female.json
    rm -rf server/vector-db/data/portraits-female.json
    just run server/portrait-processing/process-all-portraits.ts
    just start-vector-db

process-music:
    rm -rf server/vector-db/seed-data/music.json
    rm -rf server/vector-db/data/music.json
    just run server/music-processing/process-all-music.ts
    just start-vector-db

process-items:
    rm -rf server/vector-db/seed-data/items.json
    rm -rf server/vector-db/data/items.json
    just run server/item-processing/process-items.ts
    just start-vector-db