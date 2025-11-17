# n8n Knowledge Base Web Crawler

A robust, production-ready **text-only web crawler** designed to build a local n8n knowledge base for use with RAG (Retrieval-Augmented Generation) pipelines and local LLMs.

## Features

- **Text-only extraction**: Focuses exclusively on HTML text content (no images, PDFs, or binary assets)
- **Polite crawling**: Respects `robots.txt`, implements rate limiting with jitter, and uses a custom User-Agent
- **Configurable**: Extensive CLI options for customizing crawl behavior
- **Robust error handling**: Gracefully handles network errors, timeouts, and invalid content
- **Clean output**: Produces LLM-friendly JSONL format with structured metadata
- **Domain-aware**: Built-in configurations for n8n-specific domains (docs, community, blog, GitHub)
- **URL management**: Intelligent URL normalization, deduplication, and filtering

## Project Structure

```
n8n-crawler/
├── crawler/
│   ├── __init__.py           # Package initialization
│   ├── config.py             # Configuration and constants
│   ├── crawler.py            # Main crawling orchestration
│   ├── extractor.py          # HTML parsing and text extraction
│   ├── robots.py             # robots.txt handling
│   └── url_manager.py        # URL normalization and filtering
├── cli.py                    # Command-line interface entrypoint
├── requirements.txt          # Python dependencies
├── seed_urls.json           # Initial URLs to crawl
├── output/                  # Output directory (created automatically)
│   └── n8n_kb.jsonl        # Crawled data (JSONL format)
└── README.md                # This file
```

## Installation

### Prerequisites

- **Ubuntu Server** (or similar Linux distribution)
- **Python 3.8+** installed
- Internet connection

### Step 1: Set Up Python Virtual Environment

```bash
# Navigate to your desired directory
cd ~

# Clone or download the n8n-crawler project
# (If you have the files, place them in ~/n8n-crawler)

# Navigate to the project directory
cd n8n-crawler

# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install required packages
pip install -r requirements.txt
```

### Step 3: Verify Installation

```bash
# Test the CLI
python cli.py --help
```

You should see the help message with all available options.

## Configuration

### Seed URLs

The `seed_urls.json` file contains the starting URLs for the crawler. The default configuration includes key n8n resources:

- **n8n Documentation**: `https://docs.n8n.io/`
- **n8n Community Forum**: `https://community.n8n.io/`
- **n8n Blog**: `https://n8n.io/blog/`
- **n8n GitHub**: `https://github.com/n8n-io/n8n`

You can edit this file to add or remove URLs:

```json
{
  "description": "Seed URLs for n8n knowledge base crawler",
  "urls": [
    "https://docs.n8n.io/",
    "https://community.n8n.io/",
    "https://n8n.io/blog/"
  ]
}
```

### Domain Configuration

The crawler has built-in domain configurations in `crawler/config.py`:

- **docs.n8n.io**: Full documentation site
- **community.n8n.io**: Forum topics and discussions (excludes user profiles, tags)
- **n8n.io**: Blog posts only (excludes pricing, templates)
- **github.com**: n8n repository only (excludes issues, pull requests)

These can be customized in `crawler/config.py` if needed.

## Usage

### Basic Usage

```bash
# Activate virtual environment (if not already activated)
source venv/bin/activate

# Run a small test crawl (50 pages)
python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_kb.jsonl \
  --max-pages 50
```

### Recommended Production Run

```bash
# Larger crawl with 1000 pages and conservative rate limiting
python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_kb.jsonl \
  --max-pages 1000 \
  --delay-seconds 2 \
  --jitter-max 1.0
```

### Advanced Examples

#### Crawl with Custom Domains

```bash
python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_docs_only.jsonl \
  --allowed-domains "docs.n8n.io" \
  --max-pages 500
```

#### Debug Mode with Verbose Logging

```bash
python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_kb.jsonl \
  --max-pages 50 \
  --log-level DEBUG
```

#### Very Large Crawl (2000+ pages)

```bash
# Use higher delay for very large crawls to be extra polite
python cli.py \
  --seeds-file seed_urls.json \
  --output-file output/n8n_kb_full.jsonl \
  --max-pages 2000 \
  --delay-seconds 3 \
  --max-depth 15
```

## CLI Options Reference

| Option | Description | Default |
|--------|-------------|---------|
| `--seeds-file` | Path to JSON file with seed URLs | **Required** |
| `--output-file` | Path to output JSONL file | **Required** |
| `--allowed-domains` | Comma-separated allowed domains | Auto-detected from seeds |
| `--max-pages` | Maximum pages to crawl | 100 |
| `--max-depth` | Maximum link depth from seeds | 10 |
| `--delay-seconds` | Base delay between requests | 1.0 |
| `--jitter-max` | Max random jitter added to delay | 0.5 |
| `--user-agent` | Custom User-Agent string | `n8n-Knowledge-Crawler/1.0` |
| `--timeout` | Request timeout (seconds) | 30 |
| `--max-retries` | Max retries for failed requests | 3 |
| `--min-content-length` | Min text length to save page | 100 |
| `--log-level` | Logging level | INFO |

## Output Format

The crawler produces a JSONL file (JSON Lines) where each line is a valid JSON object representing one crawled page:

```json
{
  "url": "https://docs.n8n.io/workflows/components/nodes/",
  "title": "Nodes | n8n Docs",
  "headings": ["Nodes", "Node basics", "Creating nodes", "Configuring nodes"],
  "content": "Full cleaned text content of the page...",
  "source": "n8n_docs"
}
```

### Field Descriptions

- **url**: Final URL after any redirects
- **title**: Page title (from `<title>` tag or `<h1>`)
- **headings**: List of all H1, H2, and H3 headings
- **content**: Clean, plain text content with scripts, styles, and navigation removed
- **source**: Source identifier (`n8n_docs`, `n8n_forum`, `n8n_blog`, `n8n_github`)

## Post-Processing for RAG/LLM

The JSONL output is designed to be easily processed for RAG pipelines:

### 1. Chunking

Split the `content` field into smaller chunks (e.g., 500-1000 tokens) while preserving context:

```python
import json

def chunk_content(content, chunk_size=500):
    """Simple chunking by character count"""
    chunks = []
    for i in range(0, len(content), chunk_size):
        chunks.append(content[i:i+chunk_size])
    return chunks

# Read JSONL
with open('output/n8n_kb.jsonl', 'r') as f:
    for line in f:
        doc = json.loads(line)
        chunks = chunk_content(doc['content'])
        for i, chunk in enumerate(chunks):
            # Create chunk with metadata
            chunk_doc = {
                'chunk_id': f"{doc['url']}#{i}",
                'text': chunk,
                'url': doc['url'],
                'title': doc['title'],
                'source': doc['source'],
            }
            # Process chunk (embed, store, etc.)
```

### 2. Embedding and Vector Database

Use your preferred embedding model (e.g., `sentence-transformers`, OpenAI embeddings) to create vector representations:

```python
from sentence_transformers import SentenceTransformer
import chromadb

# Initialize model and vector DB
model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.Client()
collection = client.create_collection("n8n_knowledge")

# Read and embed
with open('output/n8n_kb.jsonl', 'r') as f:
    for line in f:
        doc = json.loads(line)
        embedding = model.encode(doc['content'])

        collection.add(
            embeddings=[embedding.tolist()],
            documents=[doc['content']],
            metadatas=[{
                'url': doc['url'],
                'title': doc['title'],
                'source': doc['source']
            }],
            ids=[doc['url']]
        )
```

### 3. RAG Query Example

```python
# Query the knowledge base
query = "How do I create a workflow in n8n?"
query_embedding = model.encode(query)

results = collection.query(
    query_embeddings=[query_embedding.tolist()],
    n_results=5
)

# Use results as context for your LLM
context = "\n\n".join(results['documents'][0])
prompt = f"Context:\n{context}\n\nQuestion: {query}\n\nAnswer:"

# Send to your local LLM (Ollama, llama.cpp, etc.)
```

## Troubleshooting

### Common Issues

#### 1. "robots.txt disallows" messages

Some URLs may be blocked by `robots.txt`. This is expected and the crawler will skip them automatically.

#### 2. Timeout errors

Increase the timeout value:
```bash
python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --timeout 60
```

#### 3. Too many skipped pages

Adjust the `--min-content-length` parameter:
```bash
python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --min-content-length 50
```

#### 4. Rate limiting by server

Increase the delay between requests:
```bash
python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --delay-seconds 5
```

### Logging

Use `--log-level DEBUG` to see detailed information about what the crawler is doing:

```bash
python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --log-level DEBUG
```

## Best Practices

1. **Start small**: Test with `--max-pages 50` before running larger crawls
2. **Be polite**: Use appropriate delays (`--delay-seconds 2` or higher for large crawls)
3. **Monitor progress**: Watch the periodic progress reports in the logs
4. **Backup output**: The JSONL file is appended to, so you can resume crawls
5. **Check robots.txt**: Respect the crawl rules of each site
6. **Run off-peak**: Schedule large crawls during off-peak hours when possible

## Resuming Interrupted Crawls

If a crawl is interrupted, you can resume by:

1. The output file is appended to (not overwritten)
2. However, the crawler doesn't persist the queue state
3. For long crawls, consider running multiple smaller batches:

```bash
# Batch 1: 500 pages
python cli.py --seeds-file seed_urls.json --output-file output/batch1.jsonl --max-pages 500

# Batch 2: Different seeds or continue with new seeds
python cli.py --seeds-file seed_urls2.json --output-file output/batch2.jsonl --max-pages 500

# Combine later
cat output/batch*.jsonl > output/n8n_kb_full.jsonl
```

## Performance Considerations

- **Memory**: The crawler keeps visited URLs in memory. For 10,000+ pages, expect ~100-200 MB RAM usage
- **Disk I/O**: Each page is appended to the JSONL file immediately (no buffering)
- **Network**: Respects rate limits and uses connection pooling for efficiency
- **Speed**: With 1-second delay, expect ~3,600 pages per hour maximum

## Future Enhancements

Potential improvements you can make:

1. **Persistent queue**: Save crawl state to disk for true resume capability
2. **Duplicate detection**: Use MinHash or SimHash for near-duplicate content detection
3. **Parallel crawling**: Multi-threaded or async crawling (be extra careful with rate limits!)
4. **Incremental updates**: Track last-modified dates and only re-crawl changed pages
5. **Sitemap support**: Parse sitemap.xml files for more efficient discovery

## License

This crawler is provided as-is for personal research and educational purposes. Always respect the terms of service and robots.txt of the sites you crawl.

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the logs with `--log-level DEBUG`
- Ensure all dependencies are correctly installed
- Verify network connectivity and DNS resolution

---

**Happy Crawling!** 🚀
