# Tech Events Scraper Service

Python service for scraping tech events from various sources (Eventbrite, Meetup, blogs) and sending them to the ingestion webhook.

## Features

- **Multi-source scraping**: Eventbrite API + comprehensive web scraping (Google Events, Microsoft, AWS, Confs.tech, Dev.to, Meetup)
- **AI-powered tagging**: Keyword matching + LLM fallback for event classification
- **Smart scheduling**: Daily runs for APIs, weekly for blogs
- **Deduplication**: Removes duplicates across sources
- **Rate limiting**: Respects API limits
- **Confidence scoring**: Rates event classification accuracy

## Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your API keys and webhook URL
   ```

3. **API Keys**:
   - `EVENTBRITE_API_KEY`: **Required** - Get from [Eventbrite Developer Portal](https://www.eventbrite.com/platform/)
   - `OPENAI_API_KEY`: **Optional** - For enhanced LLM-based tagging
   - `SCRAPER_WEBHOOK_URL`: **Required** - URL of your ingestion service
   - `SCRAPER_AUTH_TOKEN`: **Required** - Shared secret for webhook authentication

## Usage

### Manual Run (for testing)
```bash
python run.py manual
# OR
python main.py manual
```

### Scheduled Run (production)
```bash
python run.py
# OR
python main.py
```

The scheduler runs:
- **Daily at 3 AM UTC**: API sources (Eventbrite, and Meetup if configured)
- **Weekly on Sunday at 4 AM UTC**: Blog sources (planned)

## Architecture

```
sources/
├── eventbrite.py    # Eventbrite API integration
├── web_scraper.py   # Context7-compliant web scraping for tech events
└── blogs/           # RSS feed scrapers (planned)

models.py            # Data models (ScrapedEvent, ScrapingResult)
tagging.py          # AI tagging engine
main.py             # Main orchestrator with Context7 compliance
```

## Event Processing Pipeline

1. **Fetch**: Get events from each source with proper error handling
2. **Parse**: Convert to standardized `ScrapedEvent` format following Context7 patterns
3. **Tag**: Apply technology tags and categorization using AI engine
4. **Score**: Assign confidence score (0-1) based on classification quality
5. **Dedupe**: Remove duplicates across sources with detailed logging
6. **Send**: POST batch to ingestion webhook with authentication

## Configuration

### Rate Limits
- Eventbrite: 1000 requests/hour
- Scraper includes appropriate delays for API respect

### Search Sources
The scraper collects events from:
- **Eventbrite API**: "technology", "programming", "software", "developer", "AI", etc.
- **Web Scraping**: Google Events, Microsoft Events, AWS Events, Confs.tech, Dev.to, Meetup.com

### Event Classification
Events are automatically tagged and categorized:
- **Categories**: Conference, Meetup, Workshop, Hackathon, Webinar, etc.
- **Tags**: React, Python, AI, DevOps, Blockchain, etc. (100+ tags)
- **Confidence**: Based on keyword matches and LLM validation

## Monitoring

The scraper logs:
- Events found per source
- Deduplication statistics
- API errors and rate limiting
- Webhook delivery status

## Docker Deployment

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## Troubleshooting

### Common Issues

1. **No events found**: Check API keys and rate limits
2. **Webhook errors**: Verify `SCRAPER_WEBHOOK_URL` and `SCRAPER_AUTH_TOKEN`
3. **Low confidence scores**: Events may need manual review
4. **Duplicate events**: Cross-source deduplication is aggressive - check logs

### Debug Mode
Set `LOG_LEVEL=DEBUG` in `.env` for verbose logging. 