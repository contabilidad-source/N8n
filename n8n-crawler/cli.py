#!/usr/bin/env python3
"""
Command-line interface for the n8n web crawler.
"""

import argparse
import json
import logging
import sys
from pathlib import Path
from typing import List

from crawler.config import (
    get_logger,
    DEFAULT_USER_AGENT,
    DEFAULT_TIMEOUT,
    DEFAULT_MAX_RETRIES,
    DEFAULT_DELAY_SECONDS,
    DEFAULT_JITTER_MAX,
    DEFAULT_MAX_PAGES,
    DEFAULT_MAX_DEPTH,
    DEFAULT_MIN_CONTENT_LENGTH,
)
from crawler.crawler import WebCrawler


def load_seed_urls(seed_file: str) -> List[str]:
    """
    Load seed URLs from a JSON file.

    Args:
        seed_file: Path to JSON file containing seed URLs

    Returns:
        List of seed URLs

    Raises:
        FileNotFoundError: If seed file doesn't exist
        json.JSONDecodeError: If seed file is not valid JSON
    """
    seed_path = Path(seed_file)

    if not seed_path.exists():
        raise FileNotFoundError(f"Seed file not found: {seed_file}")

    with open(seed_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Support both list and dict with 'urls' key
    if isinstance(data, list):
        return data
    elif isinstance(data, dict) and 'urls' in data:
        return data['urls']
    else:
        raise ValueError("Seed file must contain a list of URLs or a dict with 'urls' key")


def parse_allowed_domains(domains_arg: str) -> List[str]:
    """
    Parse allowed domains from command-line argument.

    Args:
        domains_arg: Comma-separated domain names

    Returns:
        List of domain names
    """
    if not domains_arg:
        return []

    return [d.strip() for d in domains_arg.split(',') if d.strip()]


def main():
    """
    Main CLI entry point.
    """
    parser = argparse.ArgumentParser(
        description='n8n Knowledge Base Web Crawler - Extract text content for RAG/LLM use',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Small test run (50 pages)
  python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --max-pages 50

  # Larger run with custom delay
  python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --max-pages 1000 --delay-seconds 2

  # Specify allowed domains explicitly
  python cli.py --seeds-file seed_urls.json --output-file output/n8n_kb.jsonl --allowed-domains "docs.n8n.io,community.n8n.io"
        """,
    )

    # Required arguments
    parser.add_argument(
        '--seeds-file',
        type=str,
        required=True,
        help='Path to JSON file containing seed URLs',
    )

    parser.add_argument(
        '--output-file',
        type=str,
        required=True,
        help='Path to output JSONL file',
    )

    # Optional arguments
    parser.add_argument(
        '--allowed-domains',
        type=str,
        default='',
        help='Comma-separated list of allowed domains (e.g., "docs.n8n.io,community.n8n.io")',
    )

    parser.add_argument(
        '--max-pages',
        type=int,
        default=DEFAULT_MAX_PAGES,
        help=f'Maximum number of pages to crawl (default: {DEFAULT_MAX_PAGES})',
    )

    parser.add_argument(
        '--max-depth',
        type=int,
        default=DEFAULT_MAX_DEPTH,
        help=f'Maximum link depth from seed URLs (default: {DEFAULT_MAX_DEPTH})',
    )

    parser.add_argument(
        '--delay-seconds',
        type=float,
        default=DEFAULT_DELAY_SECONDS,
        help=f'Base delay between requests in seconds (default: {DEFAULT_DELAY_SECONDS})',
    )

    parser.add_argument(
        '--jitter-max',
        type=float,
        default=DEFAULT_JITTER_MAX,
        help=f'Maximum random jitter to add to delay (default: {DEFAULT_JITTER_MAX})',
    )

    parser.add_argument(
        '--user-agent',
        type=str,
        default=DEFAULT_USER_AGENT,
        help=f'User agent string (default: {DEFAULT_USER_AGENT})',
    )

    parser.add_argument(
        '--timeout',
        type=int,
        default=DEFAULT_TIMEOUT,
        help=f'Request timeout in seconds (default: {DEFAULT_TIMEOUT})',
    )

    parser.add_argument(
        '--max-retries',
        type=int,
        default=DEFAULT_MAX_RETRIES,
        help=f'Maximum number of retries for failed requests (default: {DEFAULT_MAX_RETRIES})',
    )

    parser.add_argument(
        '--min-content-length',
        type=int,
        default=DEFAULT_MIN_CONTENT_LENGTH,
        help=f'Minimum content length to save a page (default: {DEFAULT_MIN_CONTENT_LENGTH})',
    )

    parser.add_argument(
        '--log-level',
        type=str,
        default='INFO',
        choices=['DEBUG', 'INFO', 'WARNING', 'ERROR'],
        help='Logging level (default: INFO)',
    )

    args = parser.parse_args()

    # Setup logging
    log_level = getattr(logging, args.log_level)
    logger = get_logger('n8n_crawler', level=log_level)

    try:
        # Load seed URLs
        logger.info(f"Loading seed URLs from {args.seeds_file}")
        seed_urls = load_seed_urls(args.seeds_file)
        logger.info(f"Loaded {len(seed_urls)} seed URLs")

        # Parse allowed domains
        allowed_domains = parse_allowed_domains(args.allowed_domains)
        if not allowed_domains:
            # If no domains specified, extract from seed URLs
            logger.info("No allowed domains specified, extracting from seed URLs")
            from urllib.parse import urlparse
            allowed_domains = list(set(
                urlparse(url).netloc.replace('www.', '')
                for url in seed_urls
            ))
            logger.info(f"Extracted allowed domains: {allowed_domains}")

        # Initialize crawler
        crawler = WebCrawler(
            seed_urls=seed_urls,
            allowed_domains=allowed_domains,
            output_file=args.output_file,
            max_pages=args.max_pages,
            max_depth=args.max_depth,
            delay_seconds=args.delay_seconds,
            jitter_max=args.jitter_max,
            user_agent=args.user_agent,
            timeout=args.timeout,
            max_retries=args.max_retries,
            min_content_length=args.min_content_length,
        )

        # Start crawling
        logger.info("Starting crawl...")
        crawler.crawl()

        logger.info(f"Crawl completed! Output saved to {args.output_file}")
        return 0

    except FileNotFoundError as e:
        logger.error(f"File error: {e}")
        return 1

    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in seed file: {e}")
        return 1

    except KeyboardInterrupt:
        logger.warning("Crawl interrupted by user")
        return 130

    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return 1


if __name__ == '__main__':
    sys.exit(main())
