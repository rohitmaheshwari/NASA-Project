const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: true,
    }
});

// connects planetSchema with "planet" collection
module.exports = mongoose.model('Planet', planetSchema);