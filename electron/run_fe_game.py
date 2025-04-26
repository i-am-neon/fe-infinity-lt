
import sys
import os
import traceback

# Display information about the Python environment
print("Python version:", sys.version)
print("Python executable:", sys.executable)
print("Running game script from:", os.path.abspath(__file__))

# Add all necessary directories to the Python path
lt_maker_path = r'C:\Users\tommy\OneDrive\Documents\Dev\fe-infinity-lt\lt-maker-fork'
print("Using LT Maker path:", lt_maker_path)

# Make sure LT Maker is in path
if lt_maker_path not in sys.path:
    sys.path.insert(0, lt_maker_path)

# Set environment variables
os.environ['PYTHONPATH'] = lt_maker_path + os.pathsep + os.environ.get('PYTHONPATH', '')

# Try to import and run the game
try:
    print("Importing run_engine_for_project module")
    import run_engine_for_project
    print("Successfully imported run_engine_for_project")
    
    # Run the game
    print("Running game:", r'_blades-of-crestwind.ltproj')
    run_engine_for_project.main('_blades-of-crestwind.ltproj')
except ImportError as e:
    print("ERROR: Failed to import run_engine_for_project:", e)
    print("Python sys.path:", sys.path)
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)
except Exception as e:
    print("ERROR: Failed to run game:", e)
    print("Traceback:")
    traceback.print_exc()
    sys.exit(1)
