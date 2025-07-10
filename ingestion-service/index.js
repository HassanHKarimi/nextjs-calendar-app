require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

// Register CORS
fastify.register(require('@fastify/cors'), {
  origin: true
});

// Auth middleware
const authenticateRequest = async (request, reply) => {
  const authHeader = request.headers.authorization;
  const expectedToken = process.env.SCRAPER_AUTH_TOKEN;
  
  if (!expectedToken) {
    reply.code(500).send({ error: 'Server configuration error' });
    return;
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    reply.code(401).send({ error: 'Missing or invalid authorization header' });
    return;
  }
  
  const token = authHeader.substring(7);
  if (token !== expectedToken) {
    reply.code(403).send({ error: 'Invalid authentication token' });
    return;
  }
};

// Event validation schema
const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  start: z.string(), // ISO date string
  end: z.string(),   // ISO date string
  location: z.string().nullable().optional(),
  isAllDay: z.boolean().default(false),
  color: z.string().default('blue'),
  
  // Tech event fields
  category: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  eventType: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  registrationUrl: z.string().url().nullable().optional(),
  price: z.string().nullable().optional(),
  organizer: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  timezone: z.string().nullable().optional(),
  capacity: z.number().nullable().optional(),
  difficulty: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  cfpDeadline: z.string().nullable().optional(), // ISO date string
  isRecurring: z.boolean().default(false),
  sourceUrl: z.string().url().nullable().optional(),
  verified: z.boolean().default(false),
  
  // AI Scraper fields
  source: z.string(),
  confidence: z.number().min(0).max(1)
});

const batchSchema = z.object({
  events: z.array(eventSchema),
  scrape_timestamp: z.string(),
  total_events: z.number()
});

// Webhook endpoint for receiving scraped events
fastify.post('/webhooks/events', {
  preHandler: authenticateRequest
}, async (request, reply) => {
  try {
    // Validate the request body
    const { events, scrape_timestamp, total_events } = batchSchema.parse(request.body);
    
    const results = {
      received: events.length,
      processed: 0,
      skipped: 0,
      errors: []
    };
    
    // Process each event
    for (const eventData of events) {
      try {
        // Check for duplicates (same title + start date + venue)
        const existingEvent = await prisma.event.findFirst({
          where: {
            title: eventData.title,
            startDate: new Date(eventData.start),
            venue: eventData.venue || null
          }
        });
        
        if (existingEvent) {
          results.skipped++;
          continue;
        }
        
        // Create the event
        await prisma.event.create({
          data: {
            title: eventData.title,
            description: eventData.description || null,
            startDate: new Date(eventData.start),
            endDate: new Date(eventData.end),
            location: eventData.location || null,
            isAllDay: eventData.isAllDay,
            color: eventData.color,
            
            // Tech event fields
            category: eventData.category || null,
            tags: eventData.tags,
            eventType: eventData.eventType || null,
            website: eventData.website || null,
            registrationUrl: eventData.registrationUrl || null,
            price: eventData.price || null,
            organizer: eventData.organizer || null,
            venue: eventData.venue || null,
            city: eventData.city || null,
            country: eventData.country || null,
            timezone: eventData.timezone || null,
            capacity: eventData.capacity || null,
            difficulty: eventData.difficulty || null,
            language: eventData.language || null,
            cfpDeadline: eventData.cfpDeadline ? new Date(eventData.cfpDeadline) : null,
            isRecurring: eventData.isRecurring,
            sourceUrl: eventData.sourceUrl || null,
            verified: false, // Always false for scraped events
            
            // AI Scraper fields
            source: eventData.source,
            confidence: eventData.confidence,
            
            // Use a default user for scraped events (first admin user)
            userId: await getDefaultUserId()
          }
        });
        
        results.processed++;
        
      } catch (error) {
        results.errors.push({
          title: eventData.title,
          error: error.message
        });
      }
    }
    
    reply.send({
      success: true,
      ...results,
      scrape_timestamp
    });
    
  } catch (error) {
    fastify.log.error(error);
    reply.code(400).send({
      error: 'Invalid request data',
      details: error.message
    });
  }
});

// Admin endpoint to get pending events
fastify.get('/events', {
  preHandler: authenticateRequest
}, async (request, reply) => {
  try {
    const { verified, source, page = 1, limit = 50 } = request.query;
    
    const where = {};
    if (verified !== undefined) {
      where.verified = verified === 'true';
    }
    if (source) {
      where.source = source;
    }
    
    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });
    
    const total = await prisma.event.count({ where });
    
    reply.send({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal server error' });
  }
});

// Admin endpoint to approve/reject events
fastify.post('/events/approve', {
  preHandler: authenticateRequest
}, async (request, reply) => {
  try {
    const { ids } = request.body;
    
    if (!Array.isArray(ids)) {
      return reply.code(400).send({ error: 'ids must be an array' });
    }
    
    const result = await prisma.event.updateMany({
      where: {
        id: { in: ids }
      },
      data: {
        verified: true
      }
    });
    
    reply.send({
      success: true,
      updated: result.count
    });
    
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal server error' });
  }
});

fastify.post('/events/reject', {
  preHandler: authenticateRequest
}, async (request, reply) => {
  try {
    const { ids } = request.body;
    
    if (!Array.isArray(ids)) {
      return reply.code(400).send({ error: 'ids must be an array' });
    }
    
    const result = await prisma.event.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    
    reply.send({
      success: true,
      deleted: result.count
    });
    
  } catch (error) {
    fastify.log.error(error);
    reply.code(500).send({ error: 'Internal server error' });
  }
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  reply.send({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper function to get default user ID for scraped events
async function getDefaultUserId() {
  // Try to find an admin user first
  let user = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  
  // If no admin, use any user
  if (!user) {
    user = await prisma.user.findFirst();
  }
  
  // If no users exist, this will fail - should be handled in deployment
  if (!user) {
    throw new Error('No users found in database. Please create a user first.');
  }
  
  return user.id;
}

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Ingestion service running on http://${host}:${port}`);
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

start(); 