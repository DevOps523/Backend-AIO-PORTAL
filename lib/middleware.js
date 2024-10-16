// lib/middleware.js
import nextConnect from 'next-connect';
import limiter from './rateLimiter'; // Adjust the path as necessary

const middleware = nextConnect();

// Apply the rate limiter middleware
middleware.use(limiter);

export default middleware;
