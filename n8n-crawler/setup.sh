#!/bin/bash
# Quick setup script for n8n Knowledge Base Crawler

set -e

echo "=========================================="
echo "n8n Knowledge Base Crawler - Setup"
echo "=========================================="
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Verify installation
echo ""
echo "Verifying installation..."
python cli.py --help

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To activate the environment in the future, run:"
echo "  source venv/bin/activate"
echo ""
echo "To run a test crawl (50 pages):"
echo "  python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --max-pages 50"
echo ""
echo "For more information, see README.md"
echo ""
