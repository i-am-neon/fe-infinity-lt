# How to Build FE Infinity LT

This document explains the workflow for building and packaging the FE Infinity LT application for different operating systems.

## Prerequisites

Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PNPM](https://pnpm.io/)
- [Electron](https://www.electronjs.org/)
- [Python](https://www.python.org/) (for running the LT Maker engine)
- [Wine](https://www.winehq.org/) (on macOS/Linux)

## Development Workflow

For development purposes, you can run the application using:

```bash
pnpm dev
```

This will start both the client and the Electron app in development mode.

## Building for Production

**IMPORTANT**: You should always build the application on the target operating system. This means building the Windows version on Windows and the macOS version on macOS.

### Step 1: Download OS-Specific Binaries

The first step is to download OS-specific binary dependencies using our script:

```bash
node download-binaries.js
```

This script will download and set up:
- Deno runtime
- Python interpreter and required packages
- Other OS-specific dependencies

**Note**: The downloaded binaries are specific to the OS where you run the script. This is why you need to run this script separately on each target OS.

### Step 2: Build the Client

Build the React client application:

```bash
cd ../client
pnpm build
```

This will create the optimized production build in the `dist` folder.

### Step 3: Package the Electron App

Run the Electron Builder on the target OS:

#### On Windows:

```bash
pnpm run build:windows
```

or manually:

```bash
electron-builder build --windows
```

#### On macOS:

```bash
pnpm run build:mac
```

or manually:

```bash
electron-builder build --mac
```

## Why OS-Specific Building is Important

There are several reasons why you should build on each target OS:

1. **Binary compatibility**: Native modules and executables built for one OS won't work on another
2. **Path handling**: Windows uses backslashes, while macOS uses forward slashes
3. **Python packaging**: Python behaves differently on each OS, especially when packaged
4. **Permissions and executables**: File permissions and executable flags are set correctly by the native OS
5. **Signing requirements**: macOS has specific app signing requirements that need to happen on a Mac

## Common Issues

### Python Not Found in Packaged App

If Python is not found in the packaged app, it's usually because:
- The binaries were not correctly downloaded with `download-binaries.js`
- The binary paths in the packaged app are incorrect
- The app is trying to use `app.asar` paths instead of `app.asar.unpacked` paths

Solution: Make sure to run `download-binaries.js` on the target OS before packaging, and ensure the app correctly handles the `app.asar.unpacked` paths.

### Wine Not Found on macOS

If Wine is not found on macOS:

```bash
brew install --cask --no-quarantine wine-stable
```

## Release Process

For a full release:

1. Update the version in `package.json`
2. Build on Windows for Windows release
3. Build on macOS for macOS release
4. Create a GitHub release with both installers

## Testing the Build

Always test the packaged application thoroughly before distribution. Some things to check:
- Launch and initialize correctly
- Run the LT Maker editor
- Run a game
- Generate a new chapter
- Check all UI functionality

## Troubleshooting

If you encounter issues with the packaged app:
1. Check the logs at:
   - Windows: `%APPDATA%\FE Infinity\logs\`
   - macOS: `~/Library/Application Support/FE Infinity/logs/`
2. Verify Python paths in the logs
3. Ensure all binaries were correctly downloaded
4. Check that paths in the code handle the `app.asar` vs `app.asar.unpacked` distinction correctly