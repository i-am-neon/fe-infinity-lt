# FE Infinity: Lex Talionis

## macOS Prerequisites

The application requires Python 3 and Wine to be installed on your system. Follow these simple steps:

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python 3
brew install python

# Install Wine - the --no-quarantine flag prevents macOS from blocking Wine
brew install --cask --no-quarantine wine-stable
```

That's it! Once these are installed, the application should work without any additional setup.

## Troubleshooting

If you receive an error about missing components:

1. Make sure both Python and Wine are properly installed:
   ```bash
   # Check Python installation
   python3 --version
   
   # Check Wine installation
   wine --version
   ```

2. Make sure they're in your PATH:
   ```bash
   which python3
   which wine
   ```

3. If Wine was installed but is not found, you might need to add it to your PATH:
   ```bash
   echo 'export PATH="/Applications/Wine Stable.app/Contents/Resources/wine/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

## Running the Game

```bash
conda activate fe-i-lt
wine python run_engine.py
```

Or, run a specific project (like "_new.ltproj"):

```bash
wine python run_engine_for_project.py _new.ltproj
```

## Running the Editor

```bash
conda activate fe-i-lt
wine python run_editor.py
```