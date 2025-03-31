"""
Diagnostic script for FE Infinity bundled Python environment.
This script checks the Python environment, required modules, and file access
to help identify issues with the bundled Python setup.

Usage:
  On Windows: python.exe diagnose_python.py
  On macOS/Linux with Wine: wine python.exe diagnose_python.py
"""

import sys
import os
import importlib.util
import platform
import traceback

def header(title):
    """Print a section header."""
    print("\n" + "=" * 50)
    print(f"  {title}")
    print("=" * 50)

def check_module(module_name):
    """Check if a module can be imported and get its version if available."""
    try:
        module = importlib.import_module(module_name)
        version = getattr(module, '__version__', 'No version info')
        return f"✅ {module_name}: {version}"
    except ImportError as e:
        return f"❌ {module_name}: {e}"
    except Exception as e:
        return f"⚠️ {module_name}: {e}"

def check_file_exists(path):
    """Check if a file exists and is accessible."""
    if os.path.exists(path):
        if os.path.isfile(path):
            try:
                with open(path, 'r') as f:
                    size = os.path.getsize(path)
                    return f"✅ {path} (File, {size} bytes)"
            except Exception as e:
                return f"⚠️ {path} (File exists but can't be read: {e})"
        else:
            return f"✅ {path} (Directory)"
    else:
        return f"❌ {path} (Not found)"

def main():
    header("PYTHON SYSTEM INFORMATION")
    print(f"Python Version: {sys.version}")
    print(f"Platform: {sys.platform}")
    print(f"Platform Details: {platform.platform()}")
    print(f"Executable: {sys.executable}")
    print(f"Working Directory: {os.getcwd()}")
    print(f"File System Encoding: {sys.getfilesystemencoding()}")

    header("ENVIRONMENT VARIABLES")
    for var in ['PYTHONPATH', 'PYTHONHOME', 'PYTHONUNBUFFERED', 'WINEPREFIX']:
        value = os.environ.get(var, 'Not set')
        print(f"{var}: {value}")

    header("PYTHON PATH")
    for i, p in enumerate(sys.path):
        print(f"  {i}: {p} {'(exists)' if os.path.exists(p) else '(NOT FOUND)'}")

    header("REQUIRED MODULES")
    # Core modules required by LT Maker
    modules = [
        'pygame',           # For game rendering
        'numpy',            # For numerical operations
        'PyQt5',            # For editor GUI
        'typing_extensions', # For type hints
        'yaml',             # For configuration files
        'PIL',              # For image processing (Pillow)
        'pathlib',          # For path manipulation
        'json',             # For JSON parsing
        're',               # For regular expressions
        'copy',             # For deep copying
        'datetime',         # For date/time handling
        'xml',              # For XML parsing
        'sqlite3'           # For database handling
    ]

    for module in modules:
        print(check_module(module))

    header("PYGAME SUBSYSTEMS")
    # If pygame is available, check its subsystems
    try:
        import pygame
        pygame.init()
        subsystems = [
            ('display', pygame.display.get_init()),
            ('font', pygame.font.get_init()),
            ('mixer', pygame.mixer.get_init()),
            ('image', pygame.image.get_init() if hasattr(pygame.image, 'get_init') else True)
        ]
        for name, initialized in subsystems:
            print(f"Pygame {name}: {'✅ Initialized' if initialized else '❌ Not initialized'}")
        pygame.quit()
    except ImportError:
        print("❌ Pygame not available, skipping subsystem checks")
    except Exception as e:
        print(f"⚠️ Error checking Pygame subsystems: {e}")

    header("CRITICAL FILE ACCESS")
    # Check access to critical files and directories
    try:
        # Get the lt-maker-fork directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        app_dir = os.path.dirname(os.path.dirname(script_dir))
        lt_maker_dir = os.path.join(app_dir, 'lt-maker-fork')
        
        print(f"App Directory: {app_dir}")
        print(f"LT Maker Directory: {lt_maker_dir}")
        
        critical_paths = [
            lt_maker_dir,
            os.path.join(lt_maker_dir, 'run_editor.py'),
            os.path.join(lt_maker_dir, 'run_engine.py'),
            os.path.join(lt_maker_dir, 'app'),
            os.path.join(lt_maker_dir, 'app', 'engine'),
            os.path.join(script_dir, '..', 'bin', 'python', 'python.exe'),
            os.path.join(script_dir, '..', 'bin', 'python', 'python_embed', 'python.exe'),
        ]
        
        for path in critical_paths:
            print(check_file_exists(path))
        
        # Check if we can list some files in the lt-maker directory
        if os.path.exists(lt_maker_dir) and os.path.isdir(lt_maker_dir):
            files = os.listdir(lt_maker_dir)
            print(f"\nLT Maker Directory Contents (first 5 files):")
            for f in files[:5]:
                print(f"  - {f}")
    except Exception as e:
        print(f"Error checking file access: {e}")
        traceback.print_exc()

    header("DIAGNOSTICS COMPLETE")
    print("\nIf you're experiencing issues, please check the BUNDLED_PYTHON_TROUBLESHOOTING.md")
    print("file and provide the output of this script when seeking support.")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("\n" + "!" * 50)
        print(f"ERROR RUNNING DIAGNOSTIC: {e}")
        print("!" * 50)
        traceback.print_exc()
        sys.exit(1)