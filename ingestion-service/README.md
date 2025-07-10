# Tech Events Ingestion Service

Node.js/Fastify microservice for receiving scraped tech events and providing admin APIs for the QA workflow.

## Features

- **Webhook endpoint** for receiving batched events from scraper
- **Event validation** using Zod schemas
- **Duplicate detection** and prevention
- **Admin API** for pending event management
- **Bulk approve/reject** operations
- **Filtering and pagination** for large event datasets

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp env.example .env
   # Edit .env with your database URL and auth token
   ```

3. **Setup database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SCRAPER_AUTH_TOKEN`: Shared secret for webhook authentication
- `PORT`: Server port (default: 3001)
- `HOST`: Server host (default: 0.0.0.0)

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Webhook (Authentication Required)

#### POST /webhooks/events
Receive batched events from scraper service.

**Headers:**
```
Authorization: Bearer {SCRAPER_AUTH_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "events": [
    {
      "title": "React Conf 2024",
      "description": "The biggest React conference",
      "start": "2024-06-15T09:00:00Z",
      "end": "2024-06-15T17:00:00Z",
      "category": "Conference",
      "tags": ["React", "JavaScript"],
      "source": "eventbrite",
      "confidence": 0.92,
      // ... other fields
    }
  ],
  "scrape_timestamp": "2024-01-01T00:00:00Z",
  "total_events": 1
}
```

**Response:**
```json
{
  "success": true,
  "received": 1,
  "processed": 1,
  "skipped": 0,
  "errors": []
}
```

### Admin APIs (Authentication Required)

#### GET /events
List events with filtering and pagination.

**Query Parameters:**
- `verified`: `true` | `false` (filter by approval status)
- `source`: Filter by event source (eventbrite, meetup, blog)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:**
```json
{
  "events": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

#### POST /events/approve
Bulk approve events.

**Body:**
```json
{
  "ids": ["event-id-1", "event-id-2"]
}
```

#### POST /events/reject
Bulk reject (delete) events.

**Body:**
```json
{
  "ids": ["event-id-1", "event-id-2"]
}
```

### Public Endpoints

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Data Flow

1. **Scraper** sends batched events to `/webhooks/events`
2. **Service** validates each event using Zod schema
3. **Duplicate check** using title + start date + venue
4. **Events created** with `verified: false` by default
5. **Admin** reviews via Next.js UI at `/admin/events/pending`
6. **Approve/reject** operations update or delete events
7. **Approved events** appear on calendar (`verified: true`)

## Database Schema

Events include all tech event metadata:
- Basic fields: title, description, dates, location
- Tech fields: category, tags, event type, website, pricing
- Scraper fields: source, confidence, verification status
- Enhanced fields: organizer, venue, capacity, difficulty

## Error Handling

- **Authentication errors**: 401/403 responses
- **Validation errors**: 400 with detailed field errors
- **Database errors**: 500 with generic error message
- **Duplicate events**: Skipped silently (logged in response)

## Security

- **Bearer token authentication** for all protected endpoints
- **Input validation** using Zod schemas
- **SQL injection protection** via Prisma ORM
- **CORS enabled** for Next.js frontend

## Monitoring

The service logs:
- Incoming webhook requests
- Event processing statistics
- Admin API usage
- Database operations
- Error details

## Docker Deployment

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3001
CMD ["npm", "start"]
```

## Integration with Next.js

The Next.js calendar app connects to this service for admin functions:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_SCRAPER_AUTH_TOKEN=your_token_here
```

Admin page: `/admin/events/pending` 