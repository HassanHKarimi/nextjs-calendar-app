from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional
from datetime import datetime

class ScrapedEvent(BaseModel):
    """Standardized event data structure from scraping sources"""
    
    # Core fields (required)
    title: str
    start_date: datetime
    end_date: datetime
    
    # Optional core fields
    description: Optional[str] = None
    location: Optional[str] = None
    is_all_day: bool = False
    
    # Enhanced tech event fields
    category: Optional[str] = None  # Conference, Meetup, Workshop, etc.
    tags: List[str] = Field(default_factory=list)
    event_type: Optional[str] = None  # In-person, Virtual, Hybrid
    website: Optional[HttpUrl] = None
    registration_url: Optional[HttpUrl] = None
    price: Optional[str] = None
    organizer: Optional[str] = None
    venue: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None
    capacity: Optional[int] = None
    difficulty: Optional[str] = None
    language: Optional[str] = None
    cfp_deadline: Optional[datetime] = None
    is_recurring: bool = False
    source_url: Optional[HttpUrl] = None
    
    # AI scraper specific fields
    source: str  # eventbrite, meetup, blog, etc.
    confidence: float = Field(ge=0.0, le=1.0)  # 0-1 confidence score
    
    def to_api_payload(self) -> dict:
        """Convert to format expected by Next.js API"""
        return {
            "title": self.title,
            "description": self.description,
            "start": self.start_date.isoformat(),
            "end": self.end_date.isoformat(),
            "location": self.location,
            "isAllDay": self.is_all_day,
            "color": "blue",  # Default color
            
            # Tech event fields
            "category": self.category,
            "tags": self.tags,
            "eventType": self.event_type,
            "website": str(self.website) if self.website else None,
            "registrationUrl": str(self.registration_url) if self.registration_url else None,
            "price": self.price,
            "organizer": self.organizer,
            "venue": self.venue,
            "city": self.city,
            "country": self.country,
            "timezone": self.timezone,
            "capacity": self.capacity,
            "difficulty": self.difficulty,
            "language": self.language,
            "cfpDeadline": self.cfp_deadline.isoformat() if self.cfp_deadline else None,
            "isRecurring": self.is_recurring,
            "sourceUrl": str(self.source_url) if self.source_url else None,
            "verified": False,  # Always false for scraped events
            
            # AI scraper fields
            "source": self.source,
            "confidence": self.confidence
        }

class ScrapingResult(BaseModel):
    """Result from a scraping operation"""
    source: str
    events: List[ScrapedEvent]
    errors: List[str] = Field(default_factory=list)
    success_count: int = 0
    
    def __post_init__(self):
        self.success_count = len(self.events) 