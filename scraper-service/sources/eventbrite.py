import requests
import os
from datetime import datetime, timedelta
from typing import List, Optional
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import ScrapedEvent, ScrapingResult
from tagging import TaggingEngine

class EventbriteAPI:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('EVENTBRITE_API_KEY')
        self.base_url = "https://www.eventbriteapi.com/v3"
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        self.tagging_engine = TaggingEngine()
    
    def search_tech_events(self, days_ahead: int = 90) -> ScrapingResult:
        """Search for tech events on Eventbrite"""
        if not self.api_key:
            return ScrapingResult(
                source="eventbrite",
                events=[],
                errors=["No Eventbrite API key provided"]
            )
        
        try:
            # Calculate date range
            start_date = datetime.now()
            end_date = start_date + timedelta(days=days_ahead)
            
            # Tech-related search terms
            tech_queries = [
                "technology", "programming", "software", "developer", "tech",
                "javascript", "python", "react", "ai", "machine learning",
                "blockchain", "devops", "cloud", "startup"
            ]
            
            all_events = []
            errors = []
            
            for query in tech_queries:
                try:
                    events = self._search_events(
                        query=query,
                        start_date=start_date,
                        end_date=end_date
                    )
                    all_events.extend(events)
                except Exception as e:
                    errors.append(f"Search query '{query}' failed: {str(e)}")
            
            # Remove duplicates based on event ID
            unique_events = self._deduplicate_events(all_events)
            
            return ScrapingResult(
                source="eventbrite",
                events=unique_events,
                errors=errors
            )
            
        except Exception as e:
            return ScrapingResult(
                source="eventbrite",
                events=[],
                errors=[f"Eventbrite search failed: {str(e)}"]
            )
    
    def _search_events(self, query: str, start_date: datetime, end_date: datetime) -> List[ScrapedEvent]:
        """Search for events with a specific query"""
        url = f"{self.base_url}/events/search"
        
        params = {
            'q': query,
            'start_date.range_start': start_date.isoformat(),
            'start_date.range_end': end_date.isoformat(),
            'sort_by': 'date',
            'categories': '102,103',  # Science & Technology, Business & Professional
            'expand': 'venue,organizer,ticket_availability'
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
        """Parse Eventbrite event data into ScrapedEvent"""
        try:
            # Extract basic info
            title = event_data['name']['text']
            description = event_data.get('description', {}).get('text', '')
            
            # Parse dates
            start_datetime = datetime.fromisoformat(
                event_data['start']['utc'].replace('Z', '+00:00')
            )
            end_datetime = datetime.fromisoformat(
                event_data['end']['utc'].replace('Z', '+00:00')
            )
            
            # Extract venue information
            venue_info = event_data.get('venue')
            location = None
            venue = None
            city = None
            country = None
            
            if venue_info:
                address = venue_info.get('address', {})
                venue = venue_info.get('name', '')
                city = address.get('city', '')
                country = address.get('country', '')
                
                # Build location string
                location_parts = [part for part in [venue, city, country] if part]
                location = ', '.join(location_parts)
            
            # Determine if virtual
            is_online = event_data.get('online_event', False)
            event_type = "Virtual" if is_online else "In-person"
            
            # Extract pricing info
            price = "Free"
            if event_data.get('ticket_availability', {}).get('is_free') is False:
                price = "Paid"
            
            # Extract organizer
            organizer_info = event_data.get('organizer', {})
            organizer = organizer_info.get('name', '')
            
            # Get capacity
            capacity = event_data.get('capacity')
            
            # Use tagging engine to classify
            tagging_result = self.tagging_engine.tag_event(title, description)
            
            return ScrapedEvent(
                title=title,
                description=description,
                start_date=start_datetime,
                end_date=end_datetime,
                location=location,
                is_all_day=False,  # Eventbrite events typically have specific times
                
                # Tech event fields
                category=tagging_result.get('category'),
                tags=tagging_result.get('tags', []),
                event_type=event_type,
                website=event_data.get('url'),
                registration_url=event_data.get('url'),
                price=price,
                organizer=organizer,
                venue=venue,
                city=city,
                country=country,
                timezone=event_data['start'].get('timezone'),
                capacity=capacity,
                language="English",  # Default assumption
                source_url=event_data.get('url'),
                
                # Scraper specific
                source="eventbrite",
                confidence=tagging_result.get('confidence', 0.7)
            )
            
        except Exception as e:
            print(f"Error parsing Eventbrite event: {e}")
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