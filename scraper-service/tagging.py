import re
from typing import List, Optional, Set
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Technology tags organized by category (from the Next.js app)
TECH_TAGS = {
    # Frontend Technologies
    'frontend': [
        'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'CSS', 'HTML',
        'Next.js', 'Nuxt.js', 'Svelte', 'Tailwind CSS', 'Bootstrap', 'SASS',
        'Webpack', 'Vite', 'Parcel'
    ],
    
    # Backend Technologies
    'backend': [
        'Node.js', 'Python', 'Java', 'Go', 'Rust', 'PHP', 'C#', '.NET',
        'Ruby', 'Scala', 'Kotlin', 'Express.js', 'Django', 'Flask',
        'Spring Boot', 'Laravel', 'Rails'
    ],
    
    # Mobile Development
    'mobile': [
        'iOS', 'Android', 'React Native', 'Flutter', 'Swift', 'Kotlin',
        'Xamarin', 'Ionic', 'Cordova', 'Unity'
    ],
    
    # Cloud & DevOps
    'cloud': [
        'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'DevOps',
        'CI/CD', 'Jenkins', 'GitLab', 'GitHub Actions', 'Terraform',
        'Ansible', 'Serverless', 'Microservices'
    ],
    
    # Data & AI
    'data_ai': [
        'Machine Learning', 'AI', 'Data Science', 'Analytics', 'Big Data',
        'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'R',
        'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'Redis'
    ],
    
    # Blockchain & Web3
    'blockchain': [
        'Blockchain', 'Cryptocurrency', 'DeFi', 'NFT', 'Web3', 'Smart Contracts',
        'Ethereum', 'Bitcoin', 'Solidity', 'Polygon', 'Solana'
    ],
    
    # Emerging Technologies
    'emerging': [
        'AR/VR', 'IoT', 'Quantum Computing', 'Edge Computing', '5G',
        'Robotics', 'Computer Vision', 'Natural Language Processing'
    ],
    
    # Tools & Platforms
    'tools': [
        'Git', 'GitHub', 'GitLab', 'Jira', 'Slack', 'Discord', 'Figma',
        'Adobe XD', 'Sketch', 'VS Code', 'IntelliJ', 'Postman'
    ],
    
    # Methodologies
    'methodologies': [
        'Agile', 'Scrum', 'Kanban', 'TDD', 'BDD', 'Clean Code',
        'Design Patterns', 'Architecture', 'API Design', 'UX/UI'
    ]
}

# Event Categories
EVENT_CATEGORIES = [
    'Conference', 'Meetup', 'Workshop', 'Hackathon', 'Webinar',
    'Bootcamp', 'Networking', 'Job Fair', 'Product Launch',
    'Training', 'Summit', 'Expo'
]

class TaggingEngine:
    def __init__(self, use_llm: bool = True):
        self.use_llm = use_llm
        self.all_tags = self._get_all_tags()
        self.openai_client = None
        
        if use_llm and os.getenv('OPENAI_API_KEY'):
            self.openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def _get_all_tags(self) -> Set[str]:
        """Get all tech tags as a set for faster lookup"""
        all_tags = set()
        for category_tags in TECH_TAGS.values():
            all_tags.update(tag.lower() for tag in category_tags)
        return all_tags
    
    def extract_tags_keyword_matching(self, text: str) -> List[str]:
        """Extract tags using keyword matching"""
        if not text:
            return []
        
        text_lower = text.lower()
        found_tags = []
        
        # Check each tag category
        for category_tags in TECH_TAGS.values():
            for tag in category_tags:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(tag.lower()) + r'\b'
                if re.search(pattern, text_lower):
                    found_tags.append(tag)
        
        return list(set(found_tags))  # Remove duplicates
    
    def categorize_event(self, title: str, description: str = "") -> Optional[str]:
        """Categorize event based on keywords"""
        text = f"{title} {description}".lower()
        
        # Simple keyword matching for categories
        category_keywords = {
            'Conference': ['conference', 'conf', 'summit', 'convention'],
            'Meetup': ['meetup', 'meet up', 'gathering', 'group'],
            'Workshop': ['workshop', 'hands-on', 'tutorial', 'training'],
            'Hackathon': ['hackathon', 'hack', 'coding competition'],
            'Webinar': ['webinar', 'online', 'virtual', 'livestream'],
            'Bootcamp': ['bootcamp', 'intensive', 'immersive'],
            'Networking': ['networking', 'mixer', 'social'],
            'Job Fair': ['job fair', 'career', 'hiring', 'recruitment'],
            'Product Launch': ['launch', 'release', 'announcement'],
            'Training': ['training', 'certification', 'course'],
            'Expo': ['expo', 'exhibition', 'showcase', 'demo day']
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in text for keyword in keywords):
                return category
        
        return None
    
    def classify_with_llm(self, title: str, description: str = "") -> dict:
        """Use LLM for advanced classification when keyword matching is insufficient"""
        if not self.openai_client:
            return {'tags': [], 'category': None, 'confidence': 0.5}
        
        try:
            prompt = f"""
            Analyze this tech event and extract relevant information:
            
            Title: {title}
            Description: {description[:500]}...
            
            Please provide:
            1. Technology tags (from categories like Frontend, Backend, Mobile, Cloud, AI/ML, Blockchain, etc.)
            2. Event category (Conference, Meetup, Workshop, Hackathon, Webinar, Bootcamp, Networking, Job Fair, Product Launch, Training, Summit, Expo)
            3. Confidence score (0-1) for your classification
            
            Return as JSON:
            {{
                "tags": ["tag1", "tag2"],
                "category": "Conference",
                "confidence": 0.85
            }}
            """
            
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.1
            )
            
            import json
            result = json.loads(response.choices[0].message.content)
            
            # Validate tags against our known tags
            valid_tags = [tag for tag in result.get('tags', []) if tag.lower() in self.all_tags]
            result['tags'] = valid_tags
            
            # Validate category
            if result.get('category') not in EVENT_CATEGORIES:
                result['category'] = None
            
            return result
            
        except Exception as e:
            print(f"LLM classification failed: {e}")
            return {'tags': [], 'category': None, 'confidence': 0.3}
    
    def tag_event(self, title: str, description: str = "") -> dict:
        """Main tagging function - combines keyword matching with optional LLM"""
        # Start with keyword matching
        keyword_tags = self.extract_tags_keyword_matching(f"{title} {description}")
        keyword_category = self.categorize_event(title, description)
        
        # If we have good results from keywords, use them
        if len(keyword_tags) >= 2 and keyword_category:
            return {
                'tags': keyword_tags,
                'category': keyword_category,
                'confidence': 0.8  # High confidence for keyword matches
            }
        
        # If keyword matching is insufficient, try LLM
        if self.use_llm and len(keyword_tags) < 2:
            llm_result = self.classify_with_llm(title, description)
            
            # Combine keyword and LLM results
            combined_tags = list(set(keyword_tags + llm_result.get('tags', [])))
            final_category = keyword_category or llm_result.get('category')
            
            return {
                'tags': combined_tags,
                'category': final_category,
                'confidence': max(0.6, llm_result.get('confidence', 0.6))
            }
        
        # Fallback to keyword results even if limited
        return {
            'tags': keyword_tags,
            'category': keyword_category,
            'confidence': 0.5 if keyword_tags else 0.3
        } 