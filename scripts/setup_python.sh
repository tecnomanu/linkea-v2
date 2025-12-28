#!/bin/sh
# Setup Python venv and install dependencies for MongoDB parser
# Usage: ./scripts/setup_python.sh [parse <archive.gz>]

VENV_PATH="/tmp/pymongo_venv"

# Create venv if not exists
if [ ! -d "$VENV_PATH" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv "$VENV_PATH"
fi

# Activate and install
. "$VENV_PATH/bin/activate"

# Install pymongo if not installed
if ! python3 -c "import bson" 2>/dev/null; then
    echo "Installing pymongo..."
    pip install --quiet pymongo
fi

echo "Python environment ready!"

# If 'parse' argument provided, run the parser
if [ "$1" = "parse" ] && [ -n "$2" ]; then
    echo "Running parser on $2..."
    python3 /var/www/scripts/parse_mongo_archive.py "$2" "${3:-storage/mongo_import}"
else
    echo ""
    echo "To parse an archive:"
    echo "  . $VENV_PATH/bin/activate"
    echo "  python3 scripts/parse_mongo_archive.py <archive.gz>"
fi

