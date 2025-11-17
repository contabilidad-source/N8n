"""
robots.txt parsing and compliance checking.
"""

import urllib.robotparser
from typing import Dict
from urllib.parse import urlparse, urljoin

from crawler.config import get_logger, DEFAULT_USER_AGENT

logger = get_logger(__name__)


class RobotsManager:
    """
    Manages robots.txt files for multiple domains and checks URL access permissions.
    """

    def __init__(self, user_agent: str = DEFAULT_USER_AGENT):
        """
        Initialize the RobotsManager.

        Args:
            user_agent: User agent string to use when checking robots.txt rules
        """
        self.user_agent = user_agent
        self.parsers: Dict[str, urllib.robotparser.RobotFileParser] = {}

    def _get_robots_url(self, url: str) -> str:
        """
        Get the robots.txt URL for a given page URL.

        Args:
            url: Any URL from the domain

        Returns:
            The robots.txt URL for that domain
        """
        parsed = urlparse(url)
        robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
        return robots_url

    def _get_domain_key(self, url: str) -> str:
        """
        Get a domain key for caching robots.txt parsers.

        Args:
            url: Any URL from the domain

        Returns:
            Domain key (scheme://netloc)
        """
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"

    def _load_robots_txt(self, url: str) -> urllib.robotparser.RobotFileParser:
        """
        Load and parse robots.txt for the given URL's domain.

        Args:
            url: Any URL from the domain

        Returns:
            RobotFileParser instance
        """
        domain_key = self._get_domain_key(url)

        if domain_key in self.parsers:
            return self.parsers[domain_key]

        robots_url = self._get_robots_url(url)
        parser = urllib.robotparser.RobotFileParser()
        parser.set_url(robots_url)

        try:
            parser.read()
            logger.info(f"Loaded robots.txt from {robots_url}")
        except Exception as e:
            logger.warning(f"Failed to load robots.txt from {robots_url}: {e}")
            # If we can't load robots.txt, assume we can crawl
            # (conservative approach: only block if explicitly disallowed)

        self.parsers[domain_key] = parser
        return parser

    def can_fetch(self, url: str) -> bool:
        """
        Check if the given URL can be fetched according to robots.txt.

        Args:
            url: The URL to check

        Returns:
            True if the URL can be fetched, False otherwise
        """
        try:
            parser = self._load_robots_txt(url)
            can_fetch = parser.can_fetch(self.user_agent, url)

            if not can_fetch:
                logger.debug(f"robots.txt disallows: {url}")

            return can_fetch

        except Exception as e:
            logger.error(f"Error checking robots.txt for {url}: {e}")
            # On error, allow the fetch (fail open)
            return True

    def get_crawl_delay(self, url: str) -> float:
        """
        Get the crawl delay specified in robots.txt for this domain.

        Args:
            url: Any URL from the domain

        Returns:
            Crawl delay in seconds (0 if not specified)
        """
        try:
            parser = self._load_robots_txt(url)

            # Try to get crawl delay
            if hasattr(parser, 'crawl_delay'):
                delay = parser.crawl_delay(self.user_agent)
                if delay is not None:
                    return float(delay)

            return 0.0

        except Exception as e:
            logger.error(f"Error getting crawl delay for {url}: {e}")
            return 0.0
