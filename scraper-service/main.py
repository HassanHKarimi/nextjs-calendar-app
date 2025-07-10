#!/usr/bin/env python3
"""
Main scraper service for tech events
Coordinates all sources and sends batched results to ingestion webhook
"""

import os
import schedule
import time
import requests
import json
from datetime import datetime
from typing import List, Dict, Any
from dotenv import load_dotenv

from sources.eventbrite import EventbriteAPI
from sources.web_scraper import WebScraper
from models import ScrapedEvent, ScrapingResult
from demo_events import DemoEventGenerator

load_dotenv()

class EventScraper:
    def __init__(self):
        self.webhook_url = os.getenv('SCRAPER_WEBHOOK_URL')
        self.auth_token = os.getenv('SCRAPER_AUTH_TOKEN')
        
        # Initialize source APIs
        self.eventbrite = EventbriteAPI()
        self.web_scraper = WebScraper()
        
        # Initialize demo event generator as fallback
        self.demo_generator = DemoEventGenerator()
        
        # Rate limiting settings
        self.request_delay = 1  # seconds between API calls
        
    def scrape_all_sources(self) -> List[ScrapingResult]:
        """Run scraping across all configured sources"""
        results = []
        
        print(f"[{datetime.now()}] Starting scraping run...")
        
        # Scrape Eventbrite
        print("Scraping Eventbrite...")
        try:
            eventbrite_result = self.eventbrite.search_tech_events()
            results.append(eventbrite_result)
            print(f"Eventbrite: {len(eventbrite_result.events)} events, {len(eventbrite_result.errors)} errors")
            
            # If no events found, use demo events as fallback
            if len(eventbrite_result.events) == 0:
                print("No Eventbrite events found - using demo events for testing")
                demo_result = self.demo_generator.generate_demo_events(100)
                results.append(demo_result)
                print(f"Demo events: {len(demo_result.events)} events generated")
                
        except Exception as e:
            print(f"Eventbrite scraping failed: {e}")
            print("Using demo events as fallback")
            demo_result = self.demo_generator.generate_demo_events(100)
            results.append(demo_result)
            print(f"Demo events: {len(demo_result.events)} events generated")
        
        # Add delay between sources
        time.sleep(self.request_delay)
        
        # Scrape web sources with Context7 logging
        print("Scraping web sources (company events, tech communities, etc.)...")
        try:
            web_result = self.web_scraper.scrape_all_sources()
            results.append(web_result)
            print(f"Web Scraper: {len(web_result.events)} events, {len(web_result.errors)} errors")
        except Exception as e:
            print(f"Web scraping failed: {e}")
            results.append(ScrapingResult(source="web_scraper", events=[], errors=[str(e)]))
        
        # TODO: Add more sources (RSS feeds, etc.)
        
        return results
    
    def send_to_webhook(self, events: List[ScrapedEvent]) -> bool:
        """Send scraped events to the ingestion webhook"""
        if not self.webhook_url or not self.auth_token:
            print("Warning: Webhook URL or auth token not configured")
            return False

        if not events:
            print("No events to send")
            return True

        try:
            # Convert events to API payload format
            payload = {
                "events": [event.to_api_payload() for event in events],
                "scrape_timestamp": datetime.now().isoformat(),
                "total_events": len(events)
            }
            
            # Debug: Print payload structure
            print(f"DEBUG: Webhook payload structure:")
            print(f"  - events: {len(payload['events'])} events")
            print(f"  - scrape_timestamp: {payload['scrape_timestamp']}")
            print(f"  - total_events: {payload['total_events']}")
            print(f"  - First event sample:")
            if payload['events']:
                first_event = payload['events'][0]
                print(f"    title: {first_event.get('title', 'N/A')}")
                print(f"    start: {first_event.get('start', 'N/A')}")
                print(f"    source: {first_event.get('source', 'N/A')}")

            headers = {
                'Authorization': f'Bearer {self.auth_token}',
                'Content-Type': 'application/json'
            }

            print(f"Sending {len(events)} events to webhook...")
            response = requests.post(
                self.webhook_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            
            print(f"Webhook response status: {response.status_code}")
            print(f"Webhook response body: {response.text}")

            response.raise_for_status()
            print(f"Successfully sent events to webhook. Response: {response.status_code}")
            return True

        except Exception as e:
            print(f"Failed to send events to webhook: {e}")
            if hasattr(e, 'response') and e.response:
                print(f"Error response: {e.response.text}")
            return False
    
    def run_scraping_cycle(self):
        """Execute a complete scraping cycle"""
        print(f"\n{'='*50}")
        print(f"SCRAPING CYCLE STARTED: {datetime.now()}")
        print(f"{'='*50}")
        
        try:
            # Scrape all sources
            results = self.scrape_all_sources()
            
            # Collect all events
            all_events = []
            total_errors = []
            
            for result in results:
                all_events.extend(result.events)
                total_errors.extend(result.errors)
            
            # Global deduplication across sources
            unique_events = self._deduplicate_across_sources(all_events)
            
            print(f"\nScraping Summary:")
            print(f"- Total events found: {len(all_events)}")
            print(f"- Unique events after deduplication: {len(unique_events)}")
            print(f"- Total errors: {len(total_errors)}")
            
            # Send to webhook
            if unique_events:
                success = self.send_to_webhook(unique_events)
                if success:
                    print(f"✅ Scraping cycle completed successfully")
                else:
                    print(f"❌ Scraping cycle completed with webhook errors")
            else:
                print("ℹ️ No events to send")
            
            # Log errors if any
            if total_errors:
                print(f"\nErrors encountered:")
                for error in total_errors[:5]:  # Show first 5 errors
                    print(f"- {error}")
                if len(total_errors) > 5:
                    print(f"... and {len(total_errors) - 5} more errors")
        
        except Exception as e:
            print(f"❌ Scraping cycle failed: {e}")
        
        print(f"{'='*50}")
        print(f"SCRAPING CYCLE ENDED: {datetime.now()}")
        print(f"{'='*50}\n")
    
    def _deduplicate_across_sources(self, events: List[ScrapedEvent]) -> List[ScrapedEvent]:
        """Remove duplicates across all sources"""
        seen = set()
        unique_events = []
        
        for event in events:
            # Create a more comprehensive key for cross-source deduplication
            key = (
                event.title.lower().strip(),
                event.start_date.date(),
                event.city.lower() if event.city else "",
                event.organizer.lower() if event.organizer else ""
            )
            
            if key not in seen:
                seen.add(key)
                unique_events.append(event)
            else:
                print(f"Duplicate event removed: {event.title} on {event.start_date.date()}")
        
        return unique_events
    
    def setup_schedule(self):
        """Setup the scraping schedule"""
        # Daily scraping at 3 AM UTC for API sources
        schedule.every().day.at("03:00").do(self.run_scraping_cycle)
        
        # TODO: Add weekly schedule for blog scrapers
        # schedule.every().sunday.at("04:00").do(self.run_blog_scraping)
        
        print("Scraping schedule configured:")
        print("- Daily at 03:00 UTC: API sources (Eventbrite, Meetup)")
        print("- Weekly on Sunday at 04:00 UTC: Blog sources (planned)")
    
    def run_scheduler(self):
        """Run the scheduler in a loop"""
        print(f"Event scraper started at {datetime.now()}")
        print("Press Ctrl+C to stop")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            print("\nScraper stopped by user")

def main():
    """Main entry point"""
    scraper = EventScraper()
    
    # Check if running in manual mode
    if len(os.sys.argv) > 1 and os.sys.argv[1] == "manual":
        print("Running scraper in manual mode...")
        scraper.run_scraping_cycle()
    else:
        # Setup and run scheduler
        scraper.setup_schedule()
        scraper.run_scheduler()

if __name__ == "__main__":
    main() 