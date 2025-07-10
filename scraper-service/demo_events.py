#!/usr/bin/env python3
"""
Demo event generator for testing the scraper system
Creates realistic tech events when APIs are not available
"""

from datetime import datetime, timedelta
from typing import List
import random
from models import ScrapedEvent, ScrapingResult

class DemoEventGenerator:
    def __init__(self):
        self.tech_events = [
            {
                "title": "React.js Meetup: Building Modern Web Apps",
                "description": "Join us for an evening of React.js best practices, hooks, and modern development techniques. We'll cover state management, performance optimization, and the latest React features.",
                "category": "Meetup",
                "tags": ["React", "JavaScript", "Frontend", "Web Development"],
                "organizer": "Silicon Valley React Meetup",
                "venue": "Google Campus",
                "city": "Mountain View",
                "country": "USA",
                "price": "Free",
                "confidence": 0.95
            },
            {
                "title": "AI & Machine Learning Conference 2025",
                "description": "Two-day conference featuring the latest advances in artificial intelligence, machine learning, and deep learning. Speakers from Google, OpenAI, and leading universities.",
                "category": "Conference",
                "tags": ["AI", "Machine Learning", "Deep Learning", "Python", "Data Science"],
                "organizer": "AI Research Institute",
                "venue": "Convention Center",
                "city": "San Francisco",
                "country": "USA",
                "price": "Paid",
                "confidence": 0.92
            },
            {
                "title": "Python Web Development Workshop",
                "description": "Hands-on workshop covering Django, Flask, and FastAPI. Learn to build scalable web applications with Python. Includes deployment strategies and best practices.",
                "category": "Workshop",
                "tags": ["Python", "Django", "Flask", "Web Development", "Backend"],
                "organizer": "Python Software Foundation",
                "venue": "Tech Hub",
                "city": "Austin",
                "country": "USA",
                "price": "Paid",
                "confidence": 0.88
            },
            {
                "title": "DevOps & Cloud Computing Bootcamp",
                "description": "Intensive bootcamp covering Docker, Kubernetes, AWS, and CI/CD pipelines. Perfect for developers looking to expand into DevOps.",
                "category": "Bootcamp",
                "tags": ["DevOps", "Docker", "Kubernetes", "AWS", "Cloud Computing"],
                "organizer": "Cloud Native Computing Foundation",
                "venue": "Amazon Web Services Office",
                "city": "Seattle",
                "country": "USA",
                "price": "Paid",
                "confidence": 0.90
            },
            {
                "title": "Blockchain & Cryptocurrency Development",
                "description": "Learn to build decentralized applications (DApps) on Ethereum. Covers Solidity, Web3.js, and smart contract development.",
                "category": "Workshop",
                "tags": ["Blockchain", "Ethereum", "Solidity", "Cryptocurrency", "Web3"],
                "organizer": "Ethereum Foundation",
                "venue": "Virtual Event",
                "city": "Online",
                "country": "Global",
                "price": "Free",
                "confidence": 0.85
            },
            {
                "title": "Mobile App Development with React Native",
                "description": "Build cross-platform mobile apps using React Native. Covers navigation, state management, and publishing to app stores.",
                "category": "Workshop",
                "tags": ["React Native", "Mobile Development", "JavaScript", "iOS", "Android"],
                "organizer": "Mobile Dev Collective",
                "venue": "Facebook Headquarters",
                "city": "Menlo Park",
                "country": "USA",
                "price": "Paid",
                "confidence": 0.93
            },
            {
                "title": "Cybersecurity Fundamentals for Developers",
                "description": "Essential security practices for software developers. Covers OWASP Top 10, secure coding practices, and penetration testing basics.",
                "category": "Training",
                "tags": ["Cybersecurity", "Security", "OWASP", "Penetration Testing"],
                "organizer": "SANS Institute",
                "venue": "Security Training Center",
                "city": "Washington DC",
                "country": "USA",
                "price": "Paid",
                "confidence": 0.91
            },
            {
                "title": "Startup Pitch Night: Tech Edition",
                "description": "Monthly pitch night for tech startups. Present your idea to investors and get feedback from the community. Networking and drinks included.",
                "category": "Networking",
                "tags": ["Startup", "Entrepreneurship", "Pitch", "Networking", "Investment"],
                "organizer": "TechStars",
                "venue": "Innovation Hub",
                "city": "Boston",
                "country": "USA",
                "price": "Free",
                "confidence": 0.87
            }
        ]
    
    def generate_demo_events(self, count: int = 5) -> ScrapingResult:
        """Generate demo events for testing"""
        try:
            # Additional cities and venues for variation
            cities_venues = [
                {"city": "San Francisco", "country": "USA", "venue": "Tech Hub SF"},
                {"city": "New York", "country": "USA", "venue": "Manhattan Conference Center"},
                {"city": "London", "country": "UK", "venue": "London Tech Space"},
                {"city": "Berlin", "country": "Germany", "venue": "Berlin Innovation Hub"},
                {"city": "Toronto", "country": "Canada", "venue": "MaRS Discovery District"},
                {"city": "Sydney", "country": "Australia", "venue": "Sydney Tech Park"},
                {"city": "Tokyo", "country": "Japan", "venue": "Tokyo Innovation Center"},
                {"city": "Amsterdam", "country": "Netherlands", "venue": "Amsterdam Tech Quarter"},
                {"city": "Tel Aviv", "country": "Israel", "venue": "Tel Aviv University"},
                {"city": "Bangalore", "country": "India", "venue": "Electronic City"},
                {"city": "Singapore", "country": "Singapore", "venue": "Marina Bay Sands"},
                {"city": "Stockholm", "country": "Sweden", "venue": "Stockholm Tech Hub"},
                {"city": "Barcelona", "country": "Spain", "venue": "22@ Innovation District"},
                {"city": "Dublin", "country": "Ireland", "venue": "Dublin Tech Summit"},
                {"city": "Copenhagen", "country": "Denmark", "venue": "Copenhagen FinTech"},
            ]
            
            scraped_events = []
            events_created = 0
            
            # Generate events until we reach the requested count
            while events_created < count:
                for event_data in self.tech_events:
                    if events_created >= count:
                        break
                    
                    # Randomly select location variation
                    location_info = random.choice(cities_venues)
                    
                    # Generate random dates in the next 180 days for more variety
                    start_date = datetime.now() + timedelta(days=random.randint(1, 180))
                    end_date = start_date + timedelta(hours=random.randint(2, 8))
                    
                    # Add variation to titles for multiple instances
                    title_variations = [
                        event_data["title"],
                        f"{event_data['title']} - {location_info['city']} Edition",
                        f"Advanced {event_data['title']}",
                        f"{event_data['title']} Masterclass",
                        f"Virtual {event_data['title']}",
                        f"{event_data['title']} Workshop Series",
                    ]
                    
                    title = random.choice(title_variations)
                    
                    # Determine if virtual (20% chance)
                    is_virtual = random.random() < 0.2
                    event_type = "Virtual" if is_virtual else "In-person"
                    
                    # Add slight confidence variation
                    confidence_variation = random.uniform(-0.05, 0.05)
                    confidence = max(0.6, min(0.98, event_data["confidence"] + confidence_variation))
                    
                    scraped_event = ScrapedEvent(
                        title=title,
                        description=event_data["description"],
                        start_date=start_date,
                        end_date=end_date,
                        location=f"{location_info['venue']}, {location_info['city']}, {location_info['country']}" if not is_virtual else "Virtual Event",
                        is_all_day=False,
                        
                        # Tech event fields
                        category=event_data["category"],
                        tags=event_data["tags"],
                        event_type=event_type,
                        website=f"https://example.com/event-{random.randint(1000, 9999)}",
                        registration_url=f"https://example.com/register-{random.randint(1000, 9999)}",
                        price=event_data["price"],
                        organizer=event_data["organizer"],
                        venue=location_info["venue"] if not is_virtual else None,
                        city=location_info["city"] if not is_virtual else None,
                        country=location_info["country"] if not is_virtual else None,
                        timezone="UTC",
                        capacity=random.randint(50, 500) if not is_virtual else None,
                        language="English",
                        source_url=f"https://example.com/source-{random.randint(1000, 9999)}",
                        
                        # Scraper specific
                        source="eventbrite-demo",
                        confidence=confidence
                    )
                    
                    scraped_events.append(scraped_event)
                    events_created += 1
            
            return ScrapingResult(
                source="eventbrite-demo",
                events=scraped_events,
                errors=[]
            )
            
        except Exception as e:
            return ScrapingResult(
                source="eventbrite-demo",
                events=[],
                errors=[f"Demo event generation failed: {str(e)}"]
            )

if __name__ == "__main__":
    # Test the demo generator
    generator = DemoEventGenerator()
    result = generator.generate_demo_events(3)
    
    print(f"Generated {len(result.events)} demo events:")
    for event in result.events:
        print(f"- {event.title} ({event.start_date.strftime('%Y-%m-%d')})") 