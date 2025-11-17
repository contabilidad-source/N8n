# Quick Start Guide

Get up and running with the n8n Knowledge Base Crawler in under 5 minutes!

## Prerequisites

- Ubuntu server with Python 3.8+
- Internet connection

## Installation (One Command)

```bash
cd n8n-crawler && bash setup.sh
```

That's it! The setup script will:
1. Create a virtual environment
2. Install all dependencies
3. Verify the installation

## Running Your First Crawl

### Test Crawl (50 pages, ~2 minutes)

```bash
source venv/bin/activate

python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_kb.jsonl \
  --max-pages 50
```

### Production Crawl (1000 pages, ~30 minutes)

```bash
source venv/bin/activate

python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_kb.jsonl \
  --max-pages 1000 \
  --delay-seconds 2
```

## Checking Results

```bash
# Count how many pages were crawled
wc -l output/n8n_kb.jsonl

# View first page
head -n 1 output/n8n_kb.jsonl | python -m json.tool

# Search for specific content
grep -i "workflow" output/n8n_kb.jsonl | head -n 3
```

## What's Next?

The crawled data is now ready for:
- **Chunking**: Split content into smaller segments
- **Embedding**: Convert to vector embeddings
- **Vector DB**: Store in ChromaDB, Pinecone, Weaviate, etc.
- **RAG Pipeline**: Use with your local LLM (Ollama, llama.cpp, etc.)

See `README.md` for detailed instructions on post-processing and RAG integration.

## Common Commands

```bash
# Activate environment (do this each time you open a new terminal)
source venv/bin/activate

# Crawl only documentation site
python cli.py --seeds-file seed_urls.json --output-file output/docs_only.jsonl --allowed-domains "docs.n8n.io" --max-pages 500

# Debug mode
python cli.py --seeds-file seed_urls.json --output-file output/debug.jsonl --max-pages 10 --log-level DEBUG

# Very polite crawl (for large runs)
python cli.py --seeds-file seed_urls.json --output-file output/n8n_full.jsonl --max-pages 2000 --delay-seconds 3
```

## Troubleshooting

**Can't activate venv?**
```bash
source venv/bin/activate
```

**Module not found errors?**
```bash
pip install -r requirements.txt
```

**Want to see what's happening?**
```bash
python cli.py ... --log-level DEBUG
```

For more help, see the full `README.md`.
