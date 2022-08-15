const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    /* 
    // sql approach of joins which is complex to do in mongo
    target: {
        // mongoose will check and verify that any planet we reference in our lauch is actually 
        // one of the planets in our planets collection 
        type: mongoose.ObjectId,
        ref: 'Planet',
    },
    */
    // will use nosql approach, the data lives in this collection in which we are interested in
    target: {
        type: String,
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
});

// connects lauchesSchema with "launches" collection
module.exports = mongoose.model('Launch', launchesSchema);