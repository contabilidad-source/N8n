"""
Configuration and constants for the n8n web crawler.
"""

import logging
from typing import List, Dict, Any

# HTTP Configuration
DEFAULT_USER_AGENT = "n8n-Knowledge-Crawler/1.0 (Personal research; +https://github.com/yourusername)"
DEFAULT_TIMEOUT = 30  # seconds
DEFAULT_MAX_RETRIES = 3
DEFAULT_DELAY_SECONDS = 1.0  # Base delay between requests
DEFAULT_JITTER_MAX = 0.5  # Random jitter up to this many seconds

# Crawler Configuration
DEFAULT_MAX_PAGES = 100
DEFAULT_MAX_DEPTH = 10  # Maximum link depth from seed URLs
DEFAULT_MIN_CONTENT_LENGTH = 100  # Minimum text length to save a page

# Content Type Filtering
ALLOWED_CONTENT_TYPES = [
    'text/html',
    'application/xhtml+xml',
]

# URL Filtering
# Skip URLs with these patterns (calendar dates, user profiles, etc.)
URL_SKIP_PATTERNS = [
    r'/\d{4}/\d{2}/\d{2}/',  # Date-based URLs like /2023/01/15/
    r'\?page=\d+',  # Pagination with large numbers
    r'[?&]sort=',  # Sorting parameters
    r'[?&]filter=',  # Filter parameters
    r'/user/\d+/',  # User profile IDs
    r'/tag/',  # Tag pages (often navigation-heavy)
    r'/tags/',
    r'/category/',
    r'/categories/',
    r'\?share=',  # Share links
    r'#',  # Fragments (handled during normalization)
]

# Exclude certain path prefixes (can be overridden per domain)
DEFAULT_EXCLUDE_PATHS = [
    '/api/',
    '/admin/',
    '/login',
    '/logout',
    '/signin',
    '/signup',
    '/register',
    '/profile',
    '/account',
]

# n8n-specific domain configurations
N8N_DOMAIN_CONFIGS: Dict[str, Dict[str, Any]] = {
    'docs.n8n.io': {
        'source_name': 'n8n_docs',
        'include_paths': ['/'],
        'exclude_paths': [],
    },
    'community.n8n.io': {
        'source_name': 'n8n_forum',
        'include_paths': ['/t/', '/c/'],  # Topics and categories
        'exclude_paths': ['/u/', '/users/', '/tags/', '/badges/'],
    },
    'n8n.io': {
        'source_name': 'n8n_blog',
        'include_paths': ['/blog/'],
        'exclude_paths': ['/pricing', '/templates', '/creators'],
    },
    'github.com': {
        'source_name': 'n8n_github',
        'include_paths': ['/n8n-io/n8n'],
        'exclude_paths': ['/issues/', '/pulls/', '/actions/', '/commits/'],
    },
}

# HTML Cleaning - tags to remove entirely
TAGS_TO_REMOVE = [
    'script',
    'style',
    'noscript',
    'iframe',
    'svg',
    'canvas',
    'nav',
    'header',
    'footer',
    'aside',
    'form',
    'button',
]

# HTML Cleaning - common CSS classes/IDs that are typically navigation or ads
JUNK_CLASS_PATTERNS = [
    'nav',
    'menu',
    'sidebar',
    'ad',
    'advertisement',
    'promo',
    'social',
    'share',
    'cookie',
    'banner',
    'modal',
    'popup',
    'footer',
    'header',
]

# Logging Configuration
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
LOG_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

def get_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """
    Get or create a logger with consistent formatting.

    Args:
        name: Logger name
        level: Logging level (default: INFO)

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(LOG_FORMAT, LOG_DATE_FORMAT)
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    logger.setLevel(level)
    return logger


def get_source_name(url: str) -> str:
    """
    Determine the source name based on the URL domain.

    Args:
        url: The full URL

    Returns:
        Source name string (e.g., 'n8n_docs', 'n8n_forum')
    """
    from urllib.parse import urlparse

    parsed = urlparse(url)
    domain = parsed.netloc.lower()

    # Remove www. prefix if present
    if domain.startswith('www.'):
        domain = domain[4:]

    # Check if we have a specific configuration for this domain
    for config_domain, config in N8N_DOMAIN_CONFIGS.items():
        if config_domain in domain:
            return config['source_name']

    # Fallback: use domain as source name
    return domain.replace('.', '_')
