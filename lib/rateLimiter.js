// lib/rateLimiter.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Initialize Redis client only if USE_REDIS is true
let redisClient;
let store;

if (process.env.USE_REDIS === 'true') {
  redisClient = new Redis(process.env.REDIS_URL);
  
  store = new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });
}

const limiter = rateLimit({
  store: store, // Use RedisStore if available, else default in-memory store
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000, // Default to 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Default to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
  handler: (req, res) => {
    res.setHeader('Retry-After', Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000) / 1000)); // Inform client when to retry
    res.status(429).json({
      status: 429,
      message: 'Too many requests, please try again later.',
    });
  },
  keyGenerator: (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
      // 'x-forwarded-for' can be a comma-separated list of IPs. The first one is the client's IP.
      return xForwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress;
  },
});

export default limiter;
