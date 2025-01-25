# FE Infinity: Lex Talionis

## Prerequisites

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Wine
brew install wine-stable

# Install Miniconda
brew install --cask miniconda

# Initialize conda in your shell
conda init "$(basename "${SHELL}")"
```

## First Time Setup

```bash
conda create -n fe-i-lt python=3.11.7
conda activate fe-i-lt

# Setup Windows Python
curl -O https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe
wine python-3.11.7-amd64.exe

# Install requirements in Wine Python
wine pip install -r requirements_editor.txt -r requirements_engine.txt
```

## Running the Game

```bash
conda activate fe-i-lt
wine python run_engine.py
```

Or, run a specific project (like "_new.ltproj"):

```bash
wine python run_engine_for_project.py _new
```

## Running the Editor

```bash
conda activate fe-i-lt
wine python run_editor.py
```
