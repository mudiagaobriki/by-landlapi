const mongoose = require('mongoose');

// Database configuration
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            // bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering,
            dbName: process.env.DB_NAME,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('📡 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('📡 Mongoose disconnected from MongoDB');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('🔚 MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Database health check
const checkDBHealth = async () => {
    try {
        const adminDB = mongoose.connection.db.admin();
        const result = await adminDB.ping();
        return { status: 'healthy', ping: result };
    } catch (error) {
        return { status: 'unhealthy', error: error.message };
    }
};

// Get database statistics
const getDBStats = async () => {
    try {
        const stats = await mongoose.connection.db.stats();
        return {
            database: mongoose.connection.name,
            collections: stats.collections,
            dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
            storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
            indexes: stats.indexes,
            objects: stats.objects
        };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = {
    connectDB,
    checkDBHealth,
    getDBStats
};