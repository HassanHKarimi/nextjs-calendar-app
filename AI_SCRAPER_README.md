# Tech Events AI Scraper & Staging Workflow

Complete implementation of an automated tech events ingestion system with AI-powered tagging and QA workflow.

## 🎯 Overview

This system automatically scrapes tech events from multiple sources, applies AI-powered tagging and categorization, and provides an admin interface for quality assurance before events appear on the calendar.

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Python Scraper │───▶│ Ingestion Service │───▶│ Next.js Calendar│
│     Service     │    │   (Node/Fastify) │    │      App        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
       │                         │                        │
       ▼                         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ External APIs   │    │   PostgreSQL     │    │   Admin QA UI   │
│ • Eventbrite    │    │    Database      │    │ /admin/events/  │
│ • Meetup        │    │                  │    │    pending      │
│ • Blog Sources  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Components

### 1. Python Scraper Service (`/scraper-service/`)
- **Purpose**: Automated data collection from external sources
- **Sources**: Eventbrite API + comprehensive web scraping (Google, Microsoft, AWS, Confs.tech, Dev.to, Meetup)
- **Features**: AI tagging, deduplication, confidence scoring, intelligent HTML parsing
- **Schedule**: Daily 3 AM UTC for all sources

### 2. Node.js Ingestion Service (`/ingestion-service/`)
- **Purpose**: Receive and validate scraped events
- **Technology**: Fastify + Prisma + Zod validation
- **Features**: Webhook endpoint, admin APIs, duplicate prevention
- **Port**: 3001 (configurable)

### 3. Next.js Admin Interface (`/pages/admin/events/pending.tsx`)
- **Purpose**: QA workflow for event approval/rejection
- **Features**: Bulk operations, filtering, pagination
- **Access**: Admin role required
- **URL**: `/admin/events/pending`

## 📋 Implementation Status

### ✅ Phase 0: Database Enhancement
- [x] Added `source` and `confidence` fields to Event model
- [x] Applied Prisma migration
- [x] Updated TypeScript interfaces
- [x] Enhanced API endpoints

### ✅ Phase 1: Python Scraper Service
- [x] Created modular scraper architecture
- [x] Implemented Eventbrite API integration
- [x] Built comprehensive Context7-compliant web scraper (Google, Microsoft, AWS, Confs.tech, Dev.to, Meetup)
- [x] Built AI tagging engine (keyword + LLM)
- [x] Added scheduling and orchestration with proper error handling
- [x] Intelligent HTML parsing with fallback date/location extraction
- [x] Context7 compliance: proper Python path setup, logging, and resource cleanup

### ✅ Phase 2: Ingestion Microservice
- [x] Created Fastify-based webhook service
- [x] Implemented event validation and storage
- [x] Added admin API endpoints
- [x] Built duplicate detection logic

### ✅ Phase 3: Admin QA Interface
- [x] Created admin pending events page
- [x] Implemented bulk approve/reject functionality
- [x] Added filtering and pagination
- [x] Integrated with ingestion service APIs

## 🔧 Setup Instructions

### 1. Database Migration
The database is already updated with the new fields. If you need to reset:

```bash
# From main project directory
npx prisma migrate reset
npx prisma migrate dev --name add_scraper_fields
```

### 2. Scraper Service Setup
```bash
cd scraper-service
pip install -r requirements.txt
cp env.example .env
# Edit .env with your API keys
```

### 3. Ingestion Service Setup
```bash
cd ingestion-service
npm install
cp env.example .env
# Edit .env with database URL and auth token
npx prisma generate
```

### 4. Environment Configuration

**Scraper Service (`.env`):**
```env
EVENTBRITE_API_KEY=your_eventbrite_key
OPENAI_API_KEY=your_openai_key_optional
SCRAPER_WEBHOOK_URL=http://localhost:3001/webhooks/events
SCRAPER_AUTH_TOKEN=your_secure_token_here
```

**Ingestion Service (`.env`):**
```env
DATABASE_URL=your_postgresql_url
SCRAPER_AUTH_TOKEN=same_token_as_scraper
PORT=3001
```

**Next.js App (`.env.local`):**
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_SCRAPER_AUTH_TOKEN=same_token_as_above
```

## 🚀 Running the System

### Development Mode

1. **Start the ingestion service:**
   ```bash
   cd ingestion-service
   npm run dev
   ```

2. **Start the Next.js app:**
   ```bash
   npm run dev
   ```

3. **Test the scraper manually:**
   ```bash
   cd scraper-service
   python main.py manual
   ```

4. **Access admin interface:**
   - Navigate to `http://localhost:3000/admin/events/pending`
   - Login with admin credentials

### Production Mode

1. **Deploy ingestion service** (Docker/cloud)
2. **Deploy scraper service** with cron scheduling
3. **Configure environment variables** for production URLs
4. **Set up monitoring** and logging

## 📊 Data Flow

1. **Scraper runs** on schedule (daily)
2. **Fetches events** from Eventbrite API + scrapes company event pages, tech communities, conference sites
3. **Applies AI tagging** using keyword matching + LLM
4. **Assigns confidence score** based on classification quality
5. **Deduplicates** events across sources
6. **Sends batch** to ingestion webhook
7. **Ingestion service** validates and stores with `verified=false`
8. **Admin reviews** events in QA interface
9. **Approved events** set to `verified=true`
10. **Calendar displays** only verified events

## 🎯 Key Features

### AI-Powered Tagging
- **100+ technology tags** across 9 categories
- **Event categorization** (Conference, Meetup, Workshop, etc.)
- **Keyword matching** for fast, accurate tagging
- **LLM fallback** for ambiguous events
- **Confidence scoring** (0-1 scale)

### Quality Assurance
- **Staging workflow** with `verified` flag
- **Bulk operations** for efficient review
- **Source tracking** and confidence display
- **Duplicate detection** and prevention
- **Filter and search** capabilities

### Scalable Architecture
- **Microservices design** for independent scaling
- **Context7 compliance** throughout all Python components
- **Rate limiting** respects API constraints
- **Comprehensive error handling** and retry logic
- **Professional logging** and monitoring throughout

## 🛠️ API Reference

### Scraper → Ingestion Webhook
```http
POST /webhooks/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "events": [...],
  "scrape_timestamp": "2024-01-01T00:00:00Z",
  "total_events": 42
}
```

### Admin APIs
```http
GET /events?verified=false&source=eventbrite&page=1
POST /events/approve {"ids": ["id1", "id2"]}
POST /events/reject {"ids": ["id1", "id2"]}
```

## 📈 Next Steps / Enhancements

### Phase 4: Calendar Integration
- [ ] Update calendar views to show source and confidence
- [ ] Add admin toggle to show/hide pending events
- [ ] Implement event filtering by source and tags

### Phase 5: Advanced Features
- [ ] Automatic approval for high-confidence events
- [ ] Duplicate merging interface
- [ ] Community-based event validation
- [ ] Analytics dashboard for scraping performance

### Additional Sources
- [ ] Facebook Events API (requires app review)
- [ ] LinkedIn Events API
- [ ] Dev.to events scraper
- [ ] University CS department scrapers
- [ ] Conference aggregator sites

## 🔍 Monitoring & Debugging

### Logs to Monitor
- **Scraper**: Events found, API errors, webhook delivery
- **Ingestion**: Received events, validation errors, duplicates
- **Admin**: Review actions, approval/rejection rates

### Common Issues
1. **API rate limits**: Check scraper logs and adjust timing
2. **Webhook failures**: Verify auth token and service availability
3. **Low confidence**: Review tagging rules and LLM prompts
4. **Duplicate events**: Check deduplication logic and keys

## 🎉 Success Metrics

- **Events processed**: Successful ingestion rate
- **Classification accuracy**: Confidence score distribution
- **Admin efficiency**: Time spent on QA workflow
- **Calendar engagement**: User interaction with scraped events

## Security

All API keys and tokens are managed through environment variables and never committed to version control. The project includes comprehensive security measures:

- **Environment Protection**: All `.env` files are gitignored
- **Token Validation**: Authentication failures prevent API access  
- **Rate Limiting**: Respects external API limits
- **Error Handling**: No sensitive data in error messages

For detailed security guidelines, see `SECURITY.md`.

### Required Environment Variables
```bash
# Scraper Service
EVENTBRITE_API_KEY=your_eventbrite_key_required
MEETUP_API_KEY=your_meetup_key_optional  
OPENAI_API_KEY=your_openai_key_optional
SCRAPER_WEBHOOK_URL=http://localhost:3001/webhook/events
SCRAPER_AUTH_TOKEN=your_secure_token_here

# Ingestion Service  
SCRAPER_AUTH_TOKEN=same_token_as_scraper

# Next.js Frontend
NEXT_PUBLIC_SCRAPER_AUTH_TOKEN=same_token_as_above
```

The system is now ready for testing and production deployment! 🚀 