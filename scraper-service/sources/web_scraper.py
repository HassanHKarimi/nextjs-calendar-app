#!/usr/bin/env python3
"""
Web scraper for tech events following Context7 best practices
Scrapes events from major tech company pages and community sites
"""

import requests
from bs4 import BeautifulSoup
import re
import os
import time
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
from urllib.parse import urljoin, urlparse
import sys
import os

# Context7 compliance: Ensure proper Python path setup
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import ScrapedEvent, ScrapingResult
from tagging import TaggingEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebScraper:
    """
    Context7-compliant web scraper for tech events
    Follows project patterns for error handling and resource management
    """
    
    def __init__(self):
        """Initialize the web scraper with Context7 compliance"""
        try:
            self.tagging_engine = TaggingEngine()
            self.session = requests.Session()
            self.session.headers.update({
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            
            # Rate limiting for respectful scraping
            self.request_delay = 2  # seconds between requests
            
            logger.info("WebScraper initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize WebScraper: {e}")
            raise
        
    def scrape_all_sources(self) -> ScrapingResult:
        """Scrape events from all configured web sources"""
        all_events = []
        all_errors = []
        
        # Define scraping targets
        sources = [
            # Tech Company Events
            {
                'name': 'Google Events',
                'url': 'https://developers.google.com/events',
                'parser': self._parse_google_events
            },
            {
                'name': 'Microsoft Events', 
                'url': 'https://events.microsoft.com',
                'parser': self._parse_microsoft_events
            },
            {
                'name': 'AWS Events',
                'url': 'https://aws.amazon.com/events/',
                'parser': self._parse_aws_events
            },
            
            # Conference Aggregators
            {
                'name': 'Confs.tech',
                'url': 'https://confs.tech/conferences',
                'parser': self._parse_confs_tech
            },
            
            # Tech Communities
            {
                'name': 'Dev.to Events',
                'url': 'https://dev.to/listings/events',
                'parser': self._parse_dev_to_events
            },
            
            # Local Tech Groups (examples)
            {
                'name': 'Bay Area Events',
                'url': 'https://www.meetup.com/find/?keywords=programming&location=San%20Francisco%2C%20CA',
                'parser': self._parse_meetup_web
            }
        ]
        
        for source in sources:
            try:
                logger.info(f"Scraping {source['name']}...")
                events, errors = self._scrape_source(source)
                all_events.extend(events)
                all_errors.extend(errors)
                
                logger.info(f"Scraped {len(events)} events from {source['name']}")
                
                # Rate limiting between sources for respectful scraping
                time.sleep(self.request_delay)
                
            except Exception as e:
                error_msg = f"Failed to scrape {source['name']}: {str(e)}"
                logger.error(error_msg)
                all_errors.append(error_msg)
        
        # Deduplicate across all sources
        unique_events = self._deduplicate_events(all_events)
        
        logger.info(f"Web scraping completed: {len(all_events)} total events, {len(unique_events)} unique events, {len(all_errors)} errors")
        
        return ScrapingResult(
            source="web_scraper",
            events=unique_events,
            errors=all_errors
        )
    
    def _scrape_source(self, source: Dict) -> Tuple[List[ScrapedEvent], List[str]]:
        """Scrape a single source with Context7 error handling"""
        try:
            logger.debug(f"Fetching URL: {source['url']}")
            response = self.session.get(source['url'], timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            events, errors = source['parser'](soup, source['url'])
            
            if errors:
                for error in errors:
                    logger.warning(f"Parse error in {source['name']}: {error}")
            
            return events, errors
            
        except requests.exceptions.RequestException as e:
            error_msg = f"Network error scraping {source['name']}: {str(e)}"
            logger.error(error_msg)
            return [], [error_msg]
        except Exception as e:
            error_msg = f"Unexpected error scraping {source['name']}: {str(e)}"
            logger.error(error_msg)
            return [], [error_msg]
    
    def _parse_google_events(self, soup: BeautifulSoup, base_url: str) -> Tuple[List[ScrapedEvent], List[str]]:
        """Parse Google Developer Events page"""
        events = []
        errors = []
        
        try:
            # Look for event cards/containers (this would need to be customized based on actual HTML structure)
            event_elements = soup.find_all(['article', 'div'], class_=re.compile(r'event|card|listing'))
            
            for element in event_elements[:10]:  # Limit to first 10 events
                try:
                    event = self._extract_event_from_element(element, base_url, 'Google')
                    if event:
                        events.append(event)
                except Exception as e:
                    error_msg = f"Error parsing Google event: {str(e)}"
                    logger.debug(error_msg)
                    errors.append(error_msg)
                    
        except Exception as e:
            errors.append(f"Error parsing Google events page: {str(e)}")
        
        return events, errors
    
    def _parse_microsoft_events(self, soup: BeautifulSoup, base_url: str) -> Tuple[List[ScrapedEvent], List[str]]:
        """Parse Microsoft Events page"""
        events = []
        errors = []
        
        try:
            # Microsoft-specific parsing logic
            event_elements = soup.find_all(['div', 'article'], class_=re.compile(r'event|session|card'))
            
            for element in event_elements[:10]:
                try:
                    event = self._extract_event_from_element(element, base_url, 'Microsoft')
                    if event:
                        events.append(event)
                except Exception as e:
                    error_msg = f"Error parsing Microsoft event: {str(e)}"
                    logger.debug(error_msg)
                    errors.append(error_msg)
                    
        except Exception as e:
            errors.append(f"Error parsing Microsoft events page: {str(e)}")
        
        return events, errors
    
    def _parse_aws_events(self, soup: BeautifulSoup, base_url: str) -> Tuple[List[ScrapedEvent], List[str]]:
        """Parse AWS Events page"""
        events = []
        errors = []
        
        try:
            # AWS-specific parsing logic
            event_elements = soup.find_all(['div', 'section'], class_=re.compile(r'event|card|tile'))
            
            for element in event_elements[:10]:
                try:
                    event = self._extract_event_from_element(element, base_url, 'AWS')
                    if event:
                        events.append(event)
                except Exception as e:
                    error_msg = f"Error parsing AWS event: {str(e)}"
                    logger.debug(error_msg)
                    errors.append(error_msg)
                    
        except Exception as e:
            errors.append(f"Error parsing AWS events page: {str(e)}")
        
        return events, errors
    
    def _parse_confs_tech(self, soup: BeautifulSoup, base_url: str) -> Tuple[List[ScrapedEvent], List[str]]:
        """Parse Confs.tech conference aggregator"""
        events = []
        errors = []
        
        try:
            # Confs.tech specific parsing
            conference_elements = soup.find_all(['div', 'article'], class_=re.compile(r'conference|event|card'))
            
            for element in conference_elements[:15]:
                try:
                    event = self._extract_event_from_element(element, base_url, 'Confs.tech')
                    if event:
                        events.append(event)
                except Exception as e:
                    error_msg = f"Error parsing conference: {str(e)}"
                    logger.debug(error_msg)
                    errors.append(error_msg)
                    
        except Exception as e:
            errors.append(f"Error parsing Confs.tech: {str(e)}")
        
        return events, errors
    
    def _parse_dev_to_events(self, soup: BeautifulSoup, base_url: str) -> Tuple[List[ScrapedEvent], List[str]]:
        """Parse Dev.to events listings"""
        events = []
        errors = []
        
        try:
            # Dev.to specific parsing
            event_elements = soup.find_all(['div', 'article'], class_=re.compile(r'listing|event|card'))
            
            for element in event_elements[:10]:
                try:
                    event = self._extract_event_from_element(element, base_url, 'Dev.to')
                    if event:
                        events.append(event)
                except Exception as e:
                    error_msg = f"Error parsing Dev.to event: {str(e)}"
                    logger.debug(error_msg)
                    errors.append(error_msg)
                    
        except Exception as e:
            errors.append(f"Error parsing Dev.to events: {str(e)}")
        
        return events, errors
    
    def _parse_meetup_web(self, soup: BeautifulSoup, base_url: str) -> Tuple[List[ScrapedEvent], List[str]]:
        """Parse Meetup.com web pages (without API)"""
        events = []
        errors = []
        
        try:
            # Meetup web scraping logic
            event_elements = soup.find_all(['div', 'article'], class_=re.compile(r'event|meetup|card'))
            
            for element in event_elements[:8]:
                try:
                    event = self._extract_event_from_element(element, base_url, 'Meetup')
                    if event:
                        events.append(event)
                except Exception as e:
                    error_msg = f"Error parsing Meetup event: {str(e)}"
                    logger.debug(error_msg)
                    errors.append(error_msg)
                    
        except Exception as e:
            errors.append(f"Error parsing Meetup page: {str(e)}")
        
        return events, errors
    
    def _extract_event_from_element(self, element, base_url: str, organizer: str) -> Optional[ScrapedEvent]:
        """Extract event data from a DOM element"""
        try:
            # Extract title
            title_elem = element.find(['h1', 'h2', 'h3', 'h4'], class_=re.compile(r'title|name|heading'))
            if not title_elem:
                title_elem = element.find(['a', 'span'], class_=re.compile(r'title|name'))
            
            if not title_elem:
                return None
                
            title = title_elem.get_text(strip=True)
            
            # Extract description
            desc_elem = element.find(['p', 'div'], class_=re.compile(r'description|summary|excerpt'))
            description = desc_elem.get_text(strip=True) if desc_elem else ""
            
            # Extract date (this is tricky and site-specific)
            date_elem = element.find(['time', 'span', 'div'], class_=re.compile(r'date|time|when'))
            
            # Default to next month if we can't parse date
            start_date = datetime.now() + timedelta(days=30)
            end_date = start_date + timedelta(hours=3)
            
            if date_elem:
                date_text = date_elem.get_text(strip=True)
                # Try to parse common date formats
                start_date = self._parse_date_text(date_text) or start_date
                end_date = start_date + timedelta(hours=3)
            
            # Extract location
            location_elem = element.find(['span', 'div'], class_=re.compile(r'location|venue|where'))
            location = location_elem.get_text(strip=True) if location_elem else ""
            
            # Extract link
            link_elem = element.find('a', href=True)
            event_url = urljoin(base_url, link_elem['href']) if link_elem else base_url
            
            # Use AI tagging
            tagging_result = self.tagging_engine.tag_event(title, description)
            
            return ScrapedEvent(
                title=title,
                description=description,
                start_date=start_date,
                end_date=end_date,
                location=location,
                is_all_day=False,
                
                # Tech event fields
                category=tagging_result.get('category', 'Conference'),
                tags=tagging_result.get('tags', []),
                event_type="In-person",  # Default assumption
                website=event_url,
                registration_url=event_url,
                price="Unknown",
                organizer=organizer,
                language="English",
                source_url=event_url,
                
                # Scraper specific
                source="web_scraper",
                confidence=tagging_result.get('confidence', 0.6)  # Lower confidence for web scraping
            )
            
        except Exception as e:
            logger.debug(f"Error extracting event from element: {e}")
            return None
    
    def _parse_date_text(self, date_text: str) -> Optional[datetime]:
        """Try to parse various date formats"""
        try:
            # Common patterns to try
            patterns = [
                r'(\w+ \d{1,2}, \d{4})',  # "January 15, 2024"
                r'(\d{1,2}/\d{1,2}/\d{4})',  # "1/15/2024"
                r'(\d{4}-\d{2}-\d{2})',  # "2024-01-15"
            ]
            
            for pattern in patterns:
                match = re.search(pattern, date_text)
                if match:
                    try:
                        return datetime.strptime(match.group(1), '%B %d, %Y')
                    except:
                        try:
                            return datetime.strptime(match.group(1), '%m/%d/%Y')
                        except:
                            try:
                                return datetime.strptime(match.group(1), '%Y-%m-%d')
                            except:
                                continue
            
            return None
            
        except Exception:
            return None
    
    def _deduplicate_events(self, events: List[ScrapedEvent]) -> List[ScrapedEvent]:
        """Remove duplicate events with Context7 logging"""
        seen = set()
        unique_events = []
        duplicates_removed = 0
        
        for event in events:
            key = (event.title.lower().strip(), event.start_date.date())
            
            if key not in seen:
                seen.add(key)
                unique_events.append(event)
            else:
                duplicates_removed += 1
                logger.debug(f"Duplicate event removed: {event.title}")
        
        if duplicates_removed > 0:
            logger.info(f"Removed {duplicates_removed} duplicate events during web scraping")
        
        return unique_events
    
    def __del__(self):
        """Context7 cleanup: Close session when scraper is destroyed"""
        try:
            if hasattr(self, 'session'):
                self.session.close()
                logger.debug("WebScraper session closed")
        except Exception as e:
            logger.error(f"Error closing WebScraper session: {e}") 