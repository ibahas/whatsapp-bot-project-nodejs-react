const mongoose = require('mongoose');

module.exports = function applyIndexes() {
    // Message indexes
    mongoose.model('Message').createIndexes([
        { user: 1, createdAt: -1 }, // Primary query pattern
        { from: 1, user: 1 }, // For contact-based lookups
        { status: 1, user: 1 } // For pending messages
    ]);

    // User indexes
    mongoose.model('User').createIndexes([
        { phone: 1 }, // Unique index already exists
        { 'subscription.expiresAt': 1 }, // For billing checks
        { lastActiveAt: -1 } // For engagement analytics
    ]);

    // Campaign indexes
    mongoose.model('Campaign').createIndexes([
        { user: 1, createdAt: -1 },
        { status: 1, scheduledAt: 1 } // For campaign scheduler
    ]);
};