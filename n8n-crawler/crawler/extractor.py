"""
HTML parsing and text extraction.
"""

import re
from typing import List, Dict, Optional
from bs4 import BeautifulSoup, Comment

from crawler.config import (
    get_logger,
    get_source_name,
    TAGS_TO_REMOVE,
    JUNK_CLASS_PATTERNS,
    DEFAULT_MIN_CONTENT_LENGTH,
)

logger = get_logger(__name__)


class ContentExtractor:
    """
    Extracts clean text content from HTML pages.
    """

    def __init__(self, min_content_length: int = DEFAULT_MIN_CONTENT_LENGTH):
        """
        Initialize the content extractor.

        Args:
            min_content_length: Minimum text length to consider a page valid
        """
        self.min_content_length = min_content_length

    def _remove_junk_elements(self, soup: BeautifulSoup):
        """
        Remove script, style, nav, and other junk elements from the soup.

        Args:
            soup: BeautifulSoup object to clean (modified in place)
        """
        # Remove specific tags entirely
        for tag_name in TAGS_TO_REMOVE:
            for tag in soup.find_all(tag_name):
                tag.decompose()

        # Remove comments
        for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
            comment.extract()

        # Remove elements with junk classes/IDs
        for pattern in JUNK_CLASS_PATTERNS:
            # Remove by class
            for tag in soup.find_all(class_=re.compile(pattern, re.I)):
                tag.decompose()
            # Remove by ID
            for tag in soup.find_all(id=re.compile(pattern, re.I)):
                tag.decompose()

    def _extract_title(self, soup: BeautifulSoup) -> str:
        """
        Extract page title from HTML.

        Args:
            soup: BeautifulSoup object

        Returns:
            Page title or empty string
        """
        # Try <title> tag first
        title_tag = soup.find('title')
        if title_tag and title_tag.string:
            return title_tag.string.strip()

        # Try <h1> tag as fallback
        h1_tag = soup.find('h1')
        if h1_tag:
            return h1_tag.get_text(strip=True)

        # Try og:title meta tag
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            return og_title['content'].strip()

        return ""

    def _extract_headings(self, soup: BeautifulSoup) -> List[str]:
        """
        Extract all headings (h1, h2, h3) from the page.

        Args:
            soup: BeautifulSoup object

        Returns:
            List of heading texts
        """
        headings = []

        for tag_name in ['h1', 'h2', 'h3']:
            for tag in soup.find_all(tag_name):
                text = tag.get_text(strip=True)
                if text and text not in headings:  # Avoid duplicates
                    headings.append(text)

        return headings

    def _extract_main_content(self, soup: BeautifulSoup) -> str:
        """
        Extract the main text content from the page.

        Args:
            soup: BeautifulSoup object

        Returns:
            Cleaned text content
        """
        # Try to find main content area
        # Common patterns: <main>, <article>, role="main", id="content", etc.
        main_content = None

        # Try <main> tag
        main_tag = soup.find('main')
        if main_tag:
            main_content = main_tag

        # Try <article> tag
        if not main_content:
            article_tag = soup.find('article')
            if article_tag:
                main_content = article_tag

        # Try role="main"
        if not main_content:
            role_main = soup.find(attrs={'role': 'main'})
            if role_main:
                main_content = role_main

        # Try common content IDs
        if not main_content:
            for content_id in ['content', 'main-content', 'main', 'post', 'entry']:
                content_tag = soup.find(id=re.compile(content_id, re.I))
                if content_tag:
                    main_content = content_tag
                    break

        # Try common content classes
        if not main_content:
            for content_class in ['content', 'main-content', 'post-content', 'entry-content']:
                content_tag = soup.find(class_=re.compile(content_class, re.I))
                if content_tag:
                    main_content = content_tag
                    break

        # Fallback: use body
        if not main_content:
            main_content = soup.find('body')

        # If still nothing, use the whole soup
        if not main_content:
            main_content = soup

        # Extract text with some structure preserved
        text_parts = []

        # Process paragraphs, lists, and other text blocks
        for element in main_content.find_all(['p', 'li', 'dd', 'dt', 'blockquote', 'pre', 'code']):
            text = element.get_text(separator=' ', strip=True)
            if text:
                text_parts.append(text)

        # If we didn't get much content from structured elements, get all text
        if len(text_parts) < 3:
            text_parts = [main_content.get_text(separator=' ', strip=True)]

        # Join and clean
        content = '\n\n'.join(text_parts)

        # Clean up whitespace
        content = re.sub(r'\s+', ' ', content)  # Multiple spaces to single
        content = re.sub(r'\n\s*\n\s*\n+', '\n\n', content)  # Multiple newlines to double

        return content.strip()

    def extract(self, html: str, url: str) -> Optional[Dict[str, any]]:
        """
        Extract all relevant information from an HTML page.

        Args:
            html: Raw HTML content
            url: The URL of the page

        Returns:
            Dictionary with extracted data or None if page should be skipped
        """
        try:
            # Parse HTML
            soup = BeautifulSoup(html, 'lxml')

            # Remove junk elements
            self._remove_junk_elements(soup)

            # Extract components
            title = self._extract_title(soup)
            headings = self._extract_headings(soup)
            content = self._extract_main_content(soup)

            # Check minimum content length
            if len(content) < self.min_content_length:
                logger.debug(f"Content too short ({len(content)} chars): {url}")
                return None

            # Determine source
            source = get_source_name(url)

            return {
                'url': url,
                'title': title,
                'headings': headings,
                'content': content,
                'source': source,
            }

        except Exception as e:
            logger.error(f"Failed to extract content from {url}: {e}")
            return None

    def extract_links(self, html: str, base_url: str) -> List[str]:
        """
        Extract all links from an HTML page.

        Args:
            html: Raw HTML content
            base_url: Base URL for resolving relative links

        Returns:
            List of absolute URLs found on the page
        """
        try:
            soup = BeautifulSoup(html, 'lxml')
            links = []

            # Find all <a> tags with href
            for link_tag in soup.find_all('a', href=True):
                href = link_tag['href']

                # Skip empty hrefs, javascript:, mailto:, tel:, etc.
                if not href or href.startswith(('javascript:', 'mailto:', 'tel:', '#')):
                    continue

                # Skip data URIs
                if href.startswith('data:'):
                    continue

                links.append(href)

            return links

        except Exception as e:
            logger.error(f"Failed to extract links from {base_url}: {e}")
            return []
