// server/services/cache.js
const redis = require('redis');

const client = redis.createClient();

const cacheMiddleware = (key, ttl = 3600) => {
    return async (req, res, next) => {
        const data = await client.get(key);
        if (data) return res.json(JSON.parse(data));

        const originalSend = res.json;
        res.json = (body) => {
            client.setex(key, ttl, JSON.stringify(body));
            originalSend.call(res, body);
        };
        next();
    };
};

module.exports = { cacheMiddleware };
