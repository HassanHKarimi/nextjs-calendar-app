# Security Guidelines

## API Key Protection

### Environment Variables
All sensitive API keys and tokens are stored in environment variables and never hardcoded:

- `EVENTBRITE_API_KEY` - Eventbrite API access
- `MEETUP_API_KEY` - Meetup API access  
- `OPENAI_API_KEY` - OpenAI API for LLM tagging (optional)
- `SCRAPER_AUTH_TOKEN` - Webhook authentication between services
- `NEXT_PUBLIC_SCRAPER_AUTH_TOKEN` - Frontend authentication token

### .gitignore Protection
The following patterns are excluded from version control:

```
# Environment files
.env
.env.local
.env.production
.env.backup

# Service-specific environment files
scraper-service/.env
scraper-service/.env.local
scraper-service/.env.production
ingestion-service/.env
ingestion-service/.env.local
ingestion-service/.env.production

# Python cache and temporary files
scraper-service/__pycache__/
scraper-service/*.pyc
scraper-service/logs/
scraper-service/temp/

# Node.js dependencies and logs
ingestion-service/node_modules/
ingestion-service/logs/
ingestion-service/temp/
```

### Authentication Validation
All API endpoints validate authentication tokens:

1. **Scraper Service**: Validates `SCRAPER_AUTH_TOKEN` before sending webhook requests
2. **Ingestion Service**: Validates incoming webhook requests with Bearer token authentication
3. **Admin Frontend**: Validates `NEXT_PUBLIC_SCRAPER_AUTH_TOKEN` and fails gracefully if not configured

### Production Deployment
For production deployment:

1. Set all environment variables in your hosting platform
2. Never use fallback tokens like 'dev-token' in production
3. Use secure, randomly generated tokens for `SCRAPER_AUTH_TOKEN`
4. Rotate API keys periodically
5. Monitor API usage and rate limits

### Rate Limiting
External API integrations respect rate limits:

- **Eventbrite**: 1000 requests/hour
- **Meetup**: 200 requests/hour
- **OpenAI**: As per your plan limits

### Error Handling
Sensitive information is never exposed in error messages:

- API keys are not logged
- Error responses don't include internal details
- Authentication failures provide generic error messages

## Setup Checklist

Before deploying:

- [ ] All `.env.example` files copied to `.env` with real values
- [ ] API keys obtained from respective platforms
- [ ] `SCRAPER_AUTH_TOKEN` generated (use strong random string)
- [ ] Environment variables configured in hosting platform
- [ ] `.gitignore` patterns verified
- [ ] No hardcoded secrets in codebase
- [ ] Authentication validation tested

## Monitoring

Monitor for:
- Failed authentication attempts
- API rate limit violations
- Unusual webhook traffic
- Missing environment variables in logs 