import { Event } from '@/types/Event';

// Event Categories
export const EVENT_CATEGORIES = {
  CONFERENCE: 'Conference',
  MEETUP: 'Meetup',
  WORKSHOP: 'Workshop',
  HACKATHON: 'Hackathon',
  WEBINAR: 'Webinar',
  BOOTCAMP: 'Bootcamp',
  NETWORKING: 'Networking',
  JOB_FAIR: 'Job Fair',
  PRODUCT_LAUNCH: 'Product Launch',
  TRAINING: 'Training',
  SUMMIT: 'Summit',
  EXPO: 'Expo'
} as const;

// Event Types
export const EVENT_TYPES = {
  IN_PERSON: 'In-person',
  VIRTUAL: 'Virtual',
  HYBRID: 'Hybrid'
} as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  ALL_LEVELS: 'All Levels'
} as const;

// Technology Tags organized by category
export const TECH_TAGS = {
  // Frontend Technologies
  FRONTEND: [
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'CSS', 'HTML',
    'Next.js', 'Nuxt.js', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'SASS',
    'Webpack', 'Vite', 'Parcel'
  ],
  
  // Backend Technologies
  BACKEND: [
    'Node.js', 'Python', 'Java', 'Go', 'Rust', 'PHP', 'C#', '.NET',
    'Ruby', 'Scala', 'Kotlin', 'Express.js', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Rails'
  ],
  
  // Mobile Development
  MOBILE: [
    'iOS', 'Android', 'React Native', 'Flutter', 'Swift', 'Kotlin',
    'Xamarin', 'Ionic', 'Cordova', 'Unity'
  ],
  
  // Cloud & DevOps
  CLOUD: [
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'DevOps',
    'CI/CD', 'Jenkins', 'GitLab', 'GitHub Actions', 'Terraform',
    'Ansible', 'Serverless', 'Microservices'
  ],
  
  // Data & AI
  DATA_AI: [
    'Machine Learning', 'AI', 'Data Science', 'Analytics', 'Big Data',
    'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'R',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Redis'
  ],
  
  // Blockchain & Web3
  BLOCKCHAIN: [
    'Blockchain', 'Cryptocurrency', 'DeFi', 'NFT', 'Web3', 'Smart Contracts',
    'Ethereum', 'Bitcoin', 'Solidity', 'Polygon', 'Solana'
  ],
  
  // Emerging Technologies
  EMERGING: [
    'AR/VR', 'IoT', 'Quantum Computing', 'Edge Computing', '5G',
    'Robotics', 'Computer Vision', 'Natural Language Processing'
  ],
  
  // Tools & Platforms
  TOOLS: [
    'Git', 'GitHub', 'GitLab', 'Jira', 'Slack', 'Discord', 'Figma',
    'Adobe XD', 'Sketch', 'VS Code', 'IntelliJ', 'Postman'
  ],
  
  // Methodologies
  METHODOLOGIES: [
    'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'Clean Code',
    'Design Patterns', 'Architecture', 'API Design', 'UX/UI'
  ]
} as const;

// Get all tags as a flat array
export const getAllTechTags = (): string[] => {
  return Object.values(TECH_TAGS).flat() as string[];
};

// Get tags by category
export const getTagsByCategory = (category: keyof typeof TECH_TAGS): string[] => {
  return [...TECH_TAGS[category]];
};

// Color mapping for event categories
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    [EVENT_CATEGORIES.CONFERENCE]: 'blue',
    [EVENT_CATEGORIES.MEETUP]: 'green',
    [EVENT_CATEGORIES.WORKSHOP]: 'purple',
    [EVENT_CATEGORIES.HACKATHON]: 'red',
    [EVENT_CATEGORIES.WEBINAR]: 'indigo',
    [EVENT_CATEGORIES.BOOTCAMP]: 'yellow',
    [EVENT_CATEGORIES.NETWORKING]: 'pink',
    [EVENT_CATEGORIES.JOB_FAIR]: 'gray',
    [EVENT_CATEGORIES.PRODUCT_LAUNCH]: 'orange',
    [EVENT_CATEGORIES.TRAINING]: 'teal',
    [EVENT_CATEGORIES.SUMMIT]: 'cyan',
    [EVENT_CATEGORIES.EXPO]: 'lime'
  };
  
  return colorMap[category] || 'gray';
};

// Get color for tech tags
export const getTagColor = (tag: string): string => {
  const allTags = getAllTechTags();
  
  // Frontend tags - blue shades
  if (TECH_TAGS.FRONTEND.includes(tag as any)) return 'blue';
  
  // Backend tags - green shades
  if (TECH_TAGS.BACKEND.includes(tag as any)) return 'green';
  
  // Mobile tags - purple shades
  if (TECH_TAGS.MOBILE.includes(tag as any)) return 'purple';
  
  // Cloud tags - indigo shades
  if (TECH_TAGS.CLOUD.includes(tag as any)) return 'indigo';
  
  // Data/AI tags - red shades
  if (TECH_TAGS.DATA_AI.includes(tag as any)) return 'red';
  
  // Blockchain tags - yellow shades
  if (TECH_TAGS.BLOCKCHAIN.includes(tag as any)) return 'yellow';
  
  // Emerging tech tags - pink shades
  if (TECH_TAGS.EMERGING.includes(tag as any)) return 'pink';
  
  // Tools tags - gray shades
  if (TECH_TAGS.TOOLS.includes(tag as any)) return 'gray';
  
  // Methodology tags - teal shades
  if (TECH_TAGS.METHODOLOGIES.includes(tag as any)) return 'teal';
  
  return 'gray';
};

// Validate event data
export const validateTechEvent = (event: Partial<Event>): string[] => {
  const errors: string[] = [];
  
  if (!event.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!event.startDate) {
    errors.push('Start date is required');
  }
  
  if (!event.endDate) {
    errors.push('End date is required');
  }
  
  if (event.startDate && event.endDate && event.startDate >= event.endDate) {
    errors.push('End date must be after start date');
  }
  
  if (event.category && !Object.values(EVENT_CATEGORIES).includes(event.category as any)) {
    errors.push('Invalid event category');
  }
  
  if (event.eventType && !Object.values(EVENT_TYPES).includes(event.eventType as any)) {
    errors.push('Invalid event type');
  }
  
  if (event.difficulty && !Object.values(DIFFICULTY_LEVELS).includes(event.difficulty as any)) {
    errors.push('Invalid difficulty level');
  }
  
  if (event.website && !isValidUrl(event.website)) {
    errors.push('Invalid website URL');
  }
  
  if (event.registrationUrl && !isValidUrl(event.registrationUrl)) {
    errors.push('Invalid registration URL');
  }
  
  return errors;
};

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Format event for display
export const formatTechEventForDisplay = (event: Event): string => {
  const parts: string[] = [];
  
  if (event.category) {
    parts.push(`[${event.category}]`);
  }
  
  parts.push(event.title);
  
  if (event.city && event.country) {
    parts.push(`- ${event.city}, ${event.country}`);
  } else if (event.eventType === EVENT_TYPES.VIRTUAL) {
    parts.push('- Virtual');
  }
  
  return parts.join(' ');
};

// Generate sample tech events
export const generateSampleTechEvents = (): Partial<Event>[] => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  return [
    {
      title: 'React Conf 2024',
      description: 'The official React conference featuring the latest updates and best practices',
      category: EVENT_CATEGORIES.CONFERENCE,
      tags: ['React', 'JavaScript', 'Frontend'],
      eventType: EVENT_TYPES.HYBRID,
      startDate: nextWeek,
      endDate: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      city: 'San Francisco',
      country: 'USA',
      venue: 'Moscone Center',
      price: 'Paid',
      difficulty: DIFFICULTY_LEVELS.ALL_LEVELS,
      website: 'https://conf.react.dev',
      organizer: 'Meta',
      verified: true
    },
    {
      title: 'AI/ML Meetup',
      description: 'Monthly meetup for AI and Machine Learning enthusiasts',
      category: EVENT_CATEGORIES.MEETUP,
      tags: ['AI', 'Machine Learning', 'Python'],
      eventType: EVENT_TYPES.IN_PERSON,
      startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      endDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours
      city: 'New York',
      country: 'USA',
      venue: 'WeWork Times Square',
      price: 'Free',
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      organizer: 'NYC AI Meetup',
      isRecurring: true,
      verified: true
    },
    {
      title: 'Blockchain Hackathon',
      description: '48-hour hackathon focused on DeFi and Web3 applications',
      category: EVENT_CATEGORIES.HACKATHON,
      tags: ['Blockchain', 'Web3', 'DeFi', 'Smart Contracts'],
      eventType: EVENT_TYPES.IN_PERSON,
      startDate: nextMonth,
      endDate: new Date(nextMonth.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
      city: 'Austin',
      country: 'USA',
      venue: 'Capital Factory',
      price: 'Free',
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      organizer: 'ETH Austin',
      capacity: 200,
      verified: true
    }
  ];
}; 