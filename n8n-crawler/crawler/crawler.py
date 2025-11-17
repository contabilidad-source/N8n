"""
Main web crawler orchestration.
"""

import json
import time
import random
from typing import List, Optional, Dict, Any
from pathlib import Path

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

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
    ALLOWED_CONTENT_TYPES,
)
from crawler.robots import RobotsManager
from crawler.url_manager import URLManager
from crawler.extractor import ContentExtractor

logger = get_logger(__name__)


class WebCrawler:
    """
    Main web crawler that orchestrates fetching, parsing, and saving content.
    """

    def __init__(
        self,
        seed_urls: List[str],
        allowed_domains: List[str],
        output_file: str,
        max_pages: int = DEFAULT_MAX_PAGES,
        max_depth: int = DEFAULT_MAX_DEPTH,
        delay_seconds: float = DEFAULT_DELAY_SECONDS,
        jitter_max: float = DEFAULT_JITTER_MAX,
        user_agent: str = DEFAULT_USER_AGENT,
        timeout: int = DEFAULT_TIMEOUT,
        max_retries: int = DEFAULT_MAX_RETRIES,
        min_content_length: int = DEFAULT_MIN_CONTENT_LENGTH,
    ):
        """
        Initialize the web crawler.

        Args:
            seed_urls: List of starting URLs
            allowed_domains: List of allowed domain names
            output_file: Path to output JSONL file
            max_pages: Maximum number of pages to crawl
            max_depth: Maximum link depth from seed URLs
            delay_seconds: Base delay between requests
            jitter_max: Maximum random jitter to add to delay
            user_agent: User agent string
            timeout: Request timeout in seconds
            max_retries: Maximum number of retries for failed requests
            min_content_length: Minimum content length to save a page
        """
        self.seed_urls = seed_urls
        self.output_file = Path(output_file)
        self.max_pages = max_pages
        self.delay_seconds = delay_seconds
        self.jitter_max = jitter_max
        self.user_agent = user_agent
        self.timeout = timeout

        # Initialize components
        self.robots_manager = RobotsManager(user_agent=user_agent)
        self.url_manager = URLManager(
            allowed_domains=allowed_domains,
            max_depth=max_depth,
        )
        self.extractor = ContentExtractor(min_content_length=min_content_length)

        # Setup HTTP session with retries
        self.session = requests.Session()
        retry_strategy = Retry(
            total=max_retries,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "HEAD"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        # Statistics
        self.stats = {
            'pages_crawled': 0,
            'pages_saved': 0,
            'pages_skipped': 0,
            'errors': 0,
        }

        # Ensure output directory exists
        self.output_file.parent.mkdir(parents=True, exist_ok=True)

        logger.info(f"WebCrawler initialized")
        logger.info(f"Seed URLs: {len(seed_urls)}")
        logger.info(f"Allowed domains: {allowed_domains}")
        logger.info(f"Max pages: {max_pages}")
        logger.info(f"Output file: {output_file}")

    def _get_headers(self) -> Dict[str, str]:
        """
        Get HTTP headers for requests.

        Returns:
            Dictionary of headers
        """
        return {
            'User-Agent': self.user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }

    def _sleep_with_jitter(self, base_delay: Optional[float] = None):
        """
        Sleep with random jitter to be polite.

        Args:
            base_delay: Base delay in seconds (uses self.delay_seconds if None)
        """
        if base_delay is None:
            base_delay = self.delay_seconds

        jitter = random.uniform(0, self.jitter_max)
        total_delay = base_delay + jitter

        time.sleep(total_delay)

    def _is_html_content(self, response: requests.Response) -> bool:
        """
        Check if the response is HTML content.

        Args:
            response: HTTP response object

        Returns:
            True if response is HTML, False otherwise
        """
        content_type = response.headers.get('Content-Type', '').lower()

        for allowed_type in ALLOWED_CONTENT_TYPES:
            if allowed_type in content_type:
                return True

        return False

    def _fetch_url(self, url: str) -> Optional[str]:
        """
        Fetch a URL and return its HTML content.

        Args:
            url: The URL to fetch

        Returns:
            HTML content as string or None if failed
        """
        try:
            logger.info(f"Fetching: {url}")

            response = self.session.get(
                url,
                headers=self._get_headers(),
                timeout=self.timeout,
                allow_redirects=True,
            )

            # Check status code
            if response.status_code != 200:
                logger.warning(f"HTTP {response.status_code}: {url}")
                return None

            # Check content type
            if not self._is_html_content(response):
                logger.debug(f"Non-HTML content: {url}")
                return None

            # Get the final URL after redirects
            final_url = response.url
            if final_url != url:
                logger.debug(f"Redirected to: {final_url}")

            # Return HTML content
            return response.text

        except requests.exceptions.Timeout:
            logger.warning(f"Timeout: {url}")
            return None

        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed for {url}: {e}")
            return None

        except Exception as e:
            logger.error(f"Unexpected error fetching {url}: {e}")
            return None

    def _save_page(self, data: Dict[str, Any]):
        """
        Save extracted page data to JSONL file.

        Args:
            data: Dictionary with page data
        """
        try:
            # Append to JSONL file
            with open(self.output_file, 'a', encoding='utf-8') as f:
                json_line = json.dumps(data, ensure_ascii=False)
                f.write(json_line + '\n')

            self.stats['pages_saved'] += 1
            logger.info(f"Saved: {data['url']} ({len(data['content'])} chars)")

        except Exception as e:
            logger.error(f"Failed to save page {data.get('url', 'unknown')}: {e}")

    def _crawl_page(self, url: str, depth: int) -> bool:
        """
        Crawl a single page: fetch, extract, save, and queue links.

        Args:
            url: The URL to crawl
            depth: Current link depth

        Returns:
            True if page was successfully crawled, False otherwise
        """
        # Check robots.txt
        if not self.robots_manager.can_fetch(url):
            logger.info(f"Disallowed by robots.txt: {url}")
            self.stats['pages_skipped'] += 1
            return False

        # Get crawl delay from robots.txt
        robots_delay = self.robots_manager.get_crawl_delay(url)
        if robots_delay > 0:
            logger.debug(f"robots.txt specifies crawl delay: {robots_delay}s")
            self._sleep_with_jitter(robots_delay)
        else:
            # Use our default delay
            self._sleep_with_jitter()

        # Fetch the page
        html = self._fetch_url(url)
        if not html:
            self.stats['errors'] += 1
            return False

        self.stats['pages_crawled'] += 1

        # Extract content
        extracted = self.extractor.extract(html, url)
        if not extracted:
            self.stats['pages_skipped'] += 1
            return False

        # Save the page
        self._save_page(extracted)

        # Extract and queue links
        links = self.extractor.extract_links(html, url)
        self.url_manager.add_urls(links, depth=depth + 1, base_url=url)

        logger.debug(f"Found {len(links)} links on {url}")

        return True

    def crawl(self):
        """
        Main crawl loop.
        """
        # Add seed URLs to queue
        logger.info("Adding seed URLs to queue...")
        for seed_url in self.seed_urls:
            self.url_manager.add_url(seed_url, depth=0)

        logger.info(f"Starting crawl with {self.url_manager.stats()['queued']} URLs in queue")

        # Main crawl loop
        while self.url_manager.has_urls() and self.stats['pages_crawled'] < self.max_pages:
            # Get next URL
            next_item = self.url_manager.get_next_url()
            if not next_item:
                break

            url, depth = next_item

            # Crawl the page
            try:
                self._crawl_page(url, depth)
            except Exception as e:
                logger.error(f"Unexpected error crawling {url}: {e}")
                self.stats['errors'] += 1

            # Log progress periodically
            if self.stats['pages_crawled'] % 10 == 0:
                self._log_progress()

        # Final stats
        logger.info("Crawl completed!")
        self._log_progress()

    def _log_progress(self):
        """
        Log current progress statistics.
        """
        url_stats = self.url_manager.stats()

        logger.info("=" * 60)
        logger.info(f"Progress Report:")
        logger.info(f"  Pages crawled: {self.stats['pages_crawled']}")
        logger.info(f"  Pages saved: {self.stats['pages_saved']}")
        logger.info(f"  Pages skipped: {self.stats['pages_skipped']}")
        logger.info(f"  Errors: {self.stats['errors']}")
        logger.info(f"  URLs visited: {url_stats['visited']}")
        logger.info(f"  URLs in queue: {url_stats['queued']}")
        logger.info("=" * 60)
