// Import all models
const User = require('./User');
const Land = require('./Land');
const Transaction = require('./Transaction');
const Property = require('./Property');
const Incident = require('./Incident');
const LandVerification = require('./LandVerification');

// Export all models
module.exports = {
    User,
    Land,
    Transaction,
    Property,
    Incident,
    LandVerification
};