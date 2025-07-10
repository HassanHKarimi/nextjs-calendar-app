import requests
import os
from datetime import datetime, timedelta
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import ScrapedEvent, ScrapingResult
from tagging import TaggingEngine

class MeetupAPI:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('MEETUP_API_KEY')
        self.base_url = "https://api.meetup.com"
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        self.tagging_engine = TaggingEngine()
    
    def search_tech_events(self, days_ahead: int = 90) -> ScrapingResult:
        """Search for tech events on Meetup"""
        if not self.api_key:
            return ScrapingResult(
                source="meetup",
                events=[],
                errors=["No Meetup API key provided"]
            )
        
        try:
            # Calculate date range
            start_date = datetime.now()
            end_date = start_date + timedelta(days=days_ahead)
            
            # Tech-related categories and topics
            tech_topics = [
                "programming", "software-development", "javascript", "python",
                "web-development", "mobile-development", "data-science",
                "machine-learning", "artificial-intelligence", "blockchain",
                "devops", "cloud-computing", "cybersecurity", "ux-design",
                "startup", "technology"
            ]
            
            all_events = []
            errors = []
            
            for topic in tech_topics:
                try:
                    events = self._search_events_by_topic(
                        topic=topic,
                        start_date=start_date,
                        end_date=end_date
                    )
                    all_events.extend(events)
                except Exception as e:
                    errors.append(f"Search topic '{topic}' failed: {str(e)}")
            
            # Remove duplicates
            unique_events = self._deduplicate_events(all_events)
            
            return ScrapingResult(
                source="meetup",
                events=unique_events,
                errors=errors
            )
            
        except Exception as e:
            return ScrapingResult(
                source="meetup",
                events=[],
                errors=[f"Meetup search failed: {str(e)}"]
            )
    
    def _search_events_by_topic(self, topic: str, start_date: datetime, end_date: datetime) -> List[ScrapedEvent]:
        """Search for events by topic"""
        url = f"{self.base_url}/find/upcoming_events"
        
        params = {
            'text': topic,
            'start_date_range': start_date.isoformat(),
            'end_date_range': end_date.isoformat(),
            'fields': 'group,venue,featured_photo,event_hosts',
            'page': 20  # Limit per request
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        events = []
        
        for event_data in data.get('events', []):
            try:
                scraped_event = self._parse_event(event_data)
                if scraped_event:
                    events.append(scraped_event)
            except Exception as e:
                print(f"Failed to parse event {event_data.get('id', 'unknown')}: {e}")
        
        return events
    
    def _parse_event(self, event_data: dict) -> Optional[ScrapedEvent]:
        """Parse Meetup event data into ScrapedEvent"""
        try:
            # Extract basic info
            title = event_data['name']
            description = event_data.get('description', '')
            
            # Parse dates (Meetup times are in milliseconds)
            start_timestamp = event_data['time'] / 1000
            start_datetime = datetime.fromtimestamp(start_timestamp)
            
            # Duration is in milliseconds, default to 2 hours if not provided
            duration_ms = event_data.get('duration', 2 * 60 * 60 * 1000)  # 2 hours default
            end_datetime = datetime.fromtimestamp(start_timestamp + (duration_ms / 1000))
            
            # Extract venue information
            venue_info = event_data.get('venue')
            location = None
            venue = None
            city = None
            country = None
            
            if venue_info:
                venue = venue_info.get('name', '')
                city = venue_info.get('city', '')
                country = venue_info.get('localized_country_name', '')
                
                # Build location string
                location_parts = [part for part in [venue, city, country] if part]
                location = ', '.join(location_parts)
            
            # Determine if virtual (Meetup marks online events)
            is_online = event_data.get('how_to_find_us', '').lower().find('online') != -1 or \
                       event_data.get('description', '').lower().find('virtual') != -1 or \
                       venue_info is None
            
            event_type = "Virtual" if is_online else "In-person"
            
            # Extract group/organizer info
            group_info = event_data.get('group', {})
            organizer = group_info.get('name', '')
            
            # Meetup events are typically free, but some might have fees
            fee = event_data.get('fee')
            price = "Paid" if fee and fee.get('amount', 0) > 0 else "Free"
            
            # Get RSVP limit as capacity
            capacity = event_data.get('rsvp_limit')
            
            # Get event URL
            event_url = event_data.get('link')
            
            # Use tagging engine to classify
            tagging_result = self.tagging_engine.tag_event(title, description)
            
            return ScrapedEvent(
                title=title,
                description=description,
                start_date=start_datetime,
                end_date=end_datetime,
                location=location,
                is_all_day=False,  # Meetup events have specific times
                
                # Tech event fields
                category=tagging_result.get('category') or "Meetup",  # Default to Meetup if no category found
                tags=tagging_result.get('tags', []),
                event_type=event_type,
                website=event_url,
                registration_url=event_url,
                price=price,
                organizer=organizer,
                venue=venue,
                city=city,
                country=country,
                timezone=event_data.get('utc_offset', 0),  # UTC offset in milliseconds
                capacity=capacity,
                language="English",  # Default assumption
                source_url=event_url,
                
                # Scraper specific
                source="meetup",
                confidence=tagging_result.get('confidence', 0.7)
            )
            
        except Exception as e:
            print(f"Error parsing Meetup event: {e}")
            return None
    
    def _deduplicate_events(self, events: List[ScrapedEvent]) -> List[ScrapedEvent]:
        """Remove duplicate events based on title and date"""
        seen = set()
        unique_events = []
        
        for event in events:
            # Create a key based on title and start date
            key = (event.title.lower().strip(), event.start_date.date())
            
            if key not in seen:
                seen.add(key)
                unique_events.append(event)
        
        return unique_events 