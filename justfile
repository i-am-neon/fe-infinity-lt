# Set default shell
set shell := ["bash", "-c"]

# Start both the client and server
start:
    just start-server & just start-client

# Start the Deno server with Conda
start-server:
    cd server && source /opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh && conda activate fe-i-lt && deno task server

# Start the Next.js client
start-client:
    cd client && pnpm dev

# Stop all running processes
stop:
    pkill -f "deno|pnpm dev"