import { db } from '../lib/db';
import { generateSampleTechEvents, EVENT_CATEGORIES, EVENT_TYPES, DIFFICULTY_LEVELS } from '../utils/event/tech-event-utils';

async function seedTechEvents() {
  try {
    console.log('🌱 Starting tech events seeding...');
    
    // Get the first user (or create one if none exists)
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          name: 'Tech Events Admin',
          email: 'admin@techevents.com',
          role: 'ADMIN'
        }
      });
      console.log('👤 Created admin user');
    }
    
    // Clear existing events (optional - comment out if you want to keep existing events)
    // await db.event.deleteMany({});
    // console.log('🗑️  Cleared existing events');
    
    // Generate comprehensive tech events
    const techEvents = [
      // Major Conferences
      {
        title: 'React Conf 2024',
        description: 'The official React conference featuring the latest updates, best practices, and the future of React development.',
        category: EVENT_CATEGORIES.CONFERENCE,
        tags: ['React', 'JavaScript', 'Frontend', 'Next.js'],
        eventType: EVENT_TYPES.HYBRID,
        startDate: new Date('2024-05-15T09:00:00Z'),
        endDate: new Date('2024-05-17T18:00:00Z'),
        city: 'San Francisco',
        country: 'USA',
        venue: 'Moscone Center',
        price: '$599',
        difficulty: DIFFICULTY_LEVELS.ALL_LEVELS,
        website: 'https://conf.react.dev',
        registrationUrl: 'https://conf.react.dev/register',
        organizer: 'Meta',
        capacity: 2000,
        language: 'English',
        timezone: 'America/Los_Angeles',
        verified: true,
        isAllDay: false,
        color: 'blue'
      },
      {
        title: 'Google I/O 2024',
        description: 'Google\'s annual developer conference showcasing the latest in AI, Android, Web, and Cloud technologies.',
        category: EVENT_CATEGORIES.CONFERENCE,
        tags: ['AI', 'Android', 'Google Cloud', 'Machine Learning', 'Web'],
        eventType: EVENT_TYPES.HYBRID,
        startDate: new Date('2024-05-14T10:00:00Z'),
        endDate: new Date('2024-05-16T17:00:00Z'),
        city: 'Mountain View',
        country: 'USA',
        venue: 'Shoreline Amphitheatre',
        price: 'Free',
        difficulty: DIFFICULTY_LEVELS.ALL_LEVELS,
        website: 'https://io.google',
        registrationUrl: 'https://io.google/register',
        organizer: 'Google',
        capacity: 7000,
        language: 'English',
        timezone: 'America/Los_Angeles',
        verified: true,
        isAllDay: false,
        color: 'red'
      },
      {
        title: 'AWS re:Invent 2024',
        description: 'The premier cloud computing conference featuring AWS services, best practices, and customer success stories.',
        category: EVENT_CATEGORIES.CONFERENCE,
        tags: ['AWS', 'Cloud', 'DevOps', 'Serverless', 'Kubernetes'],
        eventType: EVENT_TYPES.IN_PERSON,
        startDate: new Date('2024-11-25T08:00:00Z'),
        endDate: new Date('2024-11-29T18:00:00Z'),
        city: 'Las Vegas',
        country: 'USA',
        venue: 'Multiple Vegas Hotels',
        price: '$1,799',
        difficulty: DIFFICULTY_LEVELS.ALL_LEVELS,
        website: 'https://reinvent.awsevents.com',
        registrationUrl: 'https://reinvent.awsevents.com/register',
        organizer: 'Amazon Web Services',
        capacity: 50000,
        language: 'English',
        timezone: 'America/Los_Angeles',
        verified: true,
        isAllDay: false,
        color: 'orange'
      },
      
      // Meetups
      {
        title: 'NYC JavaScript Meetup',
        description: 'Monthly meetup for JavaScript developers in New York City. This month: Modern React Patterns.',
        category: EVENT_CATEGORIES.MEETUP,
        tags: ['JavaScript', 'React', 'Frontend', 'Node.js'],
        eventType: EVENT_TYPES.IN_PERSON,
        startDate: new Date('2024-06-15T19:00:00Z'),
        endDate: new Date('2024-06-15T21:00:00Z'),
        city: 'New York',
        country: 'USA',
        venue: 'WeWork Times Square',
        price: 'Free',
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        website: 'https://www.meetup.com/javascript-nyc',
        registrationUrl: 'https://www.meetup.com/javascript-nyc/events/123456',
        organizer: 'NYC JS Community',
        capacity: 100,
        language: 'English',
        timezone: 'America/New_York',
        isRecurring: true,
        verified: true,
        isAllDay: false,
        color: 'yellow'
      },
      {
        title: 'AI/ML London Meetup',
        description: 'Exploring the latest in artificial intelligence and machine learning with industry experts.',
        category: EVENT_CATEGORIES.MEETUP,
        tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow', 'Data Science'],
        eventType: EVENT_TYPES.HYBRID,
        startDate: new Date('2024-06-20T18:30:00Z'),
        endDate: new Date('2024-06-20T21:00:00Z'),
        city: 'London',
        country: 'UK',
        venue: 'Google Campus London',
        price: 'Free',
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        website: 'https://www.meetup.com/ai-ml-london',
        registrationUrl: 'https://www.meetup.com/ai-ml-london/events/789012',
        organizer: 'London AI Community',
        capacity: 150,
        language: 'English',
        timezone: 'Europe/London',
        isRecurring: true,
        verified: true,
        isAllDay: false,
        color: 'purple'
      },
      
      // Workshops
      {
        title: 'Docker & Kubernetes Workshop',
        description: 'Hands-on workshop covering containerization with Docker and orchestration with Kubernetes.',
        category: EVENT_CATEGORIES.WORKSHOP,
        tags: ['Docker', 'Kubernetes', 'DevOps', 'Cloud', 'Containers'],
        eventType: EVENT_TYPES.IN_PERSON,
        startDate: new Date('2024-07-10T09:00:00Z'),
        endDate: new Date('2024-07-10T17:00:00Z'),
        city: 'Seattle',
        country: 'USA',
        venue: 'Microsoft Campus',
        price: '$299',
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        website: 'https://kubernetes-workshop.dev',
        registrationUrl: 'https://kubernetes-workshop.dev/register',
        organizer: 'Cloud Native Foundation',
        capacity: 50,
        language: 'English',
        timezone: 'America/Los_Angeles',
        verified: true,
        isAllDay: false,
        color: 'indigo'
      },
      
      // Hackathons
      {
        title: 'ETH Global Hackathon',
        description: '48-hour hackathon focused on building innovative DeFi and Web3 applications on Ethereum.',
        category: EVENT_CATEGORIES.HACKATHON,
        tags: ['Blockchain', 'Ethereum', 'DeFi', 'Web3', 'Smart Contracts', 'Solidity'],
        eventType: EVENT_TYPES.IN_PERSON,
        startDate: new Date('2024-08-16T18:00:00Z'),
        endDate: new Date('2024-08-18T18:00:00Z'),
        city: 'Austin',
        country: 'USA',
        venue: 'Capital Factory',
        price: 'Free',
        difficulty: DIFFICULTY_LEVELS.ADVANCED,
        website: 'https://ethglobal.com/events/austin',
        registrationUrl: 'https://ethglobal.com/events/austin/apply',
        organizer: 'ETH Global',
        capacity: 300,
        language: 'English',
        timezone: 'America/Chicago',
        verified: true,
        isAllDay: false,
        color: 'green'
      },
      
      // Webinars
      {
        title: 'Next.js 14 Deep Dive',
        description: 'Virtual webinar exploring the new features and improvements in Next.js 14.',
        category: EVENT_CATEGORIES.WEBINAR,
        tags: ['Next.js', 'React', 'JavaScript', 'Frontend', 'Vercel'],
        eventType: EVENT_TYPES.VIRTUAL,
        startDate: new Date('2024-06-25T16:00:00Z'),
        endDate: new Date('2024-06-25T17:30:00Z'),
        city: 'Virtual',
        country: 'Global',
        venue: 'Zoom',
        price: 'Free',
        difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
        website: 'https://nextjs.org/webinar',
        registrationUrl: 'https://nextjs.org/webinar/register',
        organizer: 'Vercel',
        capacity: 1000,
        language: 'English',
        timezone: 'UTC',
        verified: true,
        isAllDay: false,
        color: 'gray'
      },
      
      // Job Fair
      {
        title: 'Tech Talent Fair 2024',
        description: 'Connect with top tech companies hiring for software engineering, data science, and product roles.',
        category: EVENT_CATEGORIES.JOB_FAIR,
        tags: ['Career', 'Jobs', 'Networking', 'Software Engineering', 'Data Science'],
        eventType: EVENT_TYPES.HYBRID,
        startDate: new Date('2024-09-12T10:00:00Z'),
        endDate: new Date('2024-09-12T16:00:00Z'),
        city: 'San Francisco',
        country: 'USA',
        venue: 'Moscone Center',
        price: 'Free',
        difficulty: DIFFICULTY_LEVELS.ALL_LEVELS,
        website: 'https://techtalentfair.com',
        registrationUrl: 'https://techtalentfair.com/register',
        organizer: 'Tech Recruiters United',
        capacity: 2000,
        language: 'English',
        timezone: 'America/Los_Angeles',
        verified: true,
        isAllDay: false,
        color: 'teal'
      }
    ];
    
    // Insert tech events
    for (const eventData of techEvents) {
      await db.event.create({
        data: {
          ...eventData,
          userId: user.id,
          location: eventData.venue
        }
      });
    }
    
    console.log(`✅ Successfully seeded ${techEvents.length} tech events!`);
    console.log('🎉 Tech events database is ready!');
    
    // Display summary
    const totalEvents = await db.event.count();
    console.log(`\n📊 Event Summary: ${totalEvents} total events added to database`);
    
  } catch (error) {
    console.error('❌ Error seeding tech events:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

// Run the seeding script
if (require.main === module) {
  seedTechEvents()
    .then(() => {
      console.log('🌟 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedTechEvents; 