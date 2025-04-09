import { NextApiRequest, NextApiResponse } from "next";

// Import the handlers from the App Router auth implementation
import { GET, POST } from '@/auth';

// API routes for authentication - delegate to App Router handlers
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Pages Router Auth: forwarding to App Router implementation');
  
  try {
    // Forward to the App Router handlers based on the HTTP method
    if (req.method === 'GET') {
      return GET(req as unknown as Request, res as unknown as Response);
    } else if (req.method === 'POST') {
      return POST(req as unknown as Request, res as unknown as Response);
    } else {
      // Method not allowed
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in auth API route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}