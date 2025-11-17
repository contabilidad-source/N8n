"""
URL normalization, validation, and filtering.
"""

import re
from collections import deque
from typing import Set, List, Optional, Deque, Tuple
from urllib.parse import urlparse, urljoin, urlunparse, parse_qs, urlencode

from crawler.config import (
    get_logger,
    URL_SKIP_PATTERNS,
    DEFAULT_EXCLUDE_PATHS,
    N8N_DOMAIN_CONFIGS,
)

logger = get_logger(__name__)


class URLManager:
    """
    Manages URL queue, visited tracking, normalization, and filtering.
    """

    def __init__(
        self,
        allowed_domains: Optional[List[str]] = None,
        max_depth: int = 10,
    ):
        """
        Initialize the URL manager.

        Args:
            allowed_domains: List of allowed domain names (e.g., ['docs.n8n.io'])
            max_depth: Maximum link depth from seed URLs
        """
        self.allowed_domains = set(allowed_domains) if allowed_domains else set()
        self.max_depth = max_depth

        # URL tracking
        self.visited: Set[str] = set()
        self.queue: Deque[Tuple[str, int]] = deque()  # (url, depth)

        # Compile skip patterns
        self.skip_patterns = [re.compile(pattern) for pattern in URL_SKIP_PATTERNS]

        logger.info(f"URLManager initialized with allowed domains: {self.allowed_domains}")

    def normalize_url(self, url: str, base_url: Optional[str] = None) -> Optional[str]:
        """
        Normalize a URL by resolving relative URLs, removing fragments, sorting query params.

        Args:
            url: The URL to normalize
            base_url: Optional base URL for resolving relative URLs

        Returns:
            Normalized URL or None if invalid
        """
        try:
            # Resolve relative URLs
            if base_url:
                url = urljoin(base_url, url)

            # Parse the URL
            parsed = urlparse(url)

            # Skip non-HTTP(S) schemes
            if parsed.scheme not in ('http', 'https'):
                return None

            # Remove fragment
            parsed = parsed._replace(fragment='')

            # Normalize query parameters (sort them for consistency)
            if parsed.query:
                params = parse_qs(parsed.query, keep_blank_values=True)
                # Sort parameters
                sorted_query = urlencode(sorted(params.items()), doseq=True)
                parsed = parsed._replace(query=sorted_query)

            # Rebuild URL
            normalized = urlunparse(parsed)

            # Remove trailing slash for consistency (except for root paths)
            if normalized.endswith('/') and len(parsed.path) > 1:
                normalized = normalized[:-1]

            return normalized

        except Exception as e:
            logger.debug(f"Failed to normalize URL {url}: {e}")
            return None

    def is_allowed_domain(self, url: str) -> bool:
        """
        Check if the URL's domain is in the allowed list.

        Args:
            url: The URL to check

        Returns:
            True if domain is allowed, False otherwise
        """
        if not self.allowed_domains:
            # If no domains specified, allow all
            return True

        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()

            # Remove www. prefix for comparison
            if domain.startswith('www.'):
                domain = domain[4:]

            # Check if domain matches any allowed domain
            for allowed in self.allowed_domains:
                if allowed.lower() in domain or domain in allowed.lower():
                    return True

            return False

        except Exception as e:
            logger.debug(f"Failed to check domain for {url}: {e}")
            return False

    def should_skip_url(self, url: str) -> bool:
        """
        Check if URL matches any skip patterns or exclusion rules.

        Args:
            url: The URL to check

        Returns:
            True if URL should be skipped, False otherwise
        """
        # Check against skip patterns
        for pattern in self.skip_patterns:
            if pattern.search(url):
                logger.debug(f"URL matches skip pattern: {url}")
                return True

        # Check against domain-specific exclude paths
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            path = parsed.path.lower()

            # Remove www. prefix
            if domain.startswith('www.'):
                domain = domain[4:]

            # Check domain-specific configurations
            for config_domain, config in N8N_DOMAIN_CONFIGS.items():
                if config_domain in domain:
                    # Check include paths
                    include_paths = config.get('include_paths', [])
                    if include_paths:
                        # If include_paths specified, path must match one of them
                        if not any(path.startswith(inc.lower()) for inc in include_paths):
                            logger.debug(f"URL path not in include_paths: {url}")
                            return True

                    # Check exclude paths
                    exclude_paths = config.get('exclude_paths', [])
                    if any(path.startswith(exc.lower()) for exc in exclude_paths):
                        logger.debug(f"URL path in exclude_paths: {url}")
                        return True

                    # Found matching domain config, done checking
                    return False

            # Check default exclude paths
            if any(path.startswith(exc.lower()) for exc in DEFAULT_EXCLUDE_PATHS):
                logger.debug(f"URL path in default exclude_paths: {url}")
                return True

        except Exception as e:
            logger.debug(f"Error checking skip rules for {url}: {e}")

        return False

    def is_valid_url(self, url: str) -> bool:
        """
        Validate URL against all rules (domain, skip patterns, etc.).

        Args:
            url: The URL to validate

        Returns:
            True if URL is valid and should be crawled, False otherwise
        """
        # Check if URL is in allowed domains
        if not self.is_allowed_domain(url):
            return False

        # Check if URL should be skipped
        if self.should_skip_url(url):
            return False

        # Check URL length (avoid extremely long URLs)
        if len(url) > 2000:
            logger.debug(f"URL too long: {url[:100]}...")
            return False

        return True

    def add_url(self, url: str, depth: int = 0, base_url: Optional[str] = None) -> bool:
        """
        Add a URL to the crawl queue if valid and not visited.

        Args:
            url: The URL to add
            depth: Current link depth
            base_url: Optional base URL for resolving relative URLs

        Returns:
            True if URL was added, False otherwise
        """
        # Normalize the URL
        normalized = self.normalize_url(url, base_url)
        if not normalized:
            return False

        # Check depth limit
        if depth > self.max_depth:
            logger.debug(f"URL exceeds max depth ({depth}): {normalized}")
            return False

        # Check if already visited or queued
        if normalized in self.visited:
            return False

        # Validate URL
        if not self.is_valid_url(normalized):
            return False

        # Add to queue and visited set
        self.queue.append((normalized, depth))
        self.visited.add(normalized)

        logger.debug(f"Added to queue (depth {depth}): {normalized}")
        return True

    def add_urls(self, urls: List[str], depth: int = 0, base_url: Optional[str] = None):
        """
        Add multiple URLs to the queue.

        Args:
            urls: List of URLs to add
            depth: Current link depth
            base_url: Optional base URL for resolving relative URLs
        """
        for url in urls:
            self.add_url(url, depth, base_url)

    def get_next_url(self) -> Optional[Tuple[str, int]]:
        """
        Get the next URL from the queue.

        Returns:
            Tuple of (url, depth) or None if queue is empty
        """
        if self.queue:
            return self.queue.popleft()
        return None

    def has_urls(self) -> bool:
        """
        Check if there are more URLs to crawl.

        Returns:
            True if queue is not empty, False otherwise
        """
        return len(self.queue) > 0

    def stats(self) -> dict:
        """
        Get statistics about URL management.

        Returns:
            Dictionary with stats
        """
        return {
            'visited': len(self.visited),
            'queued': len(self.queue),
            'total': len(self.visited) + len(self.queue),
        }
