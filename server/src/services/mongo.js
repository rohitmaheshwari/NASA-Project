const mongoose = require('mongoose');

// a database named as 'nasa' will be created if it already doesn't exists
const MONGO_URL = process.env.MONGO_URL;

// emits an event when a connection is ready or some error
// .once will make sure that emit this event only once
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    /*** the options parameter was used in the older version of MongoDB but not anymore
    await mongoose.connect(MONGO_URL, {
        // this determines how mongoose parses that connection string ...
        // that we just copied into our mongoose URL
        useNewUrlParser: true,
        // by making it false, it disables the outdated way of updating Mongo data using find and modify
        useFindAndModify: false,
        // will use CreateIndex function rather than the older ensureIndex
        useCreateIndex: true,
        // this way mongoose will use updated way of talking to clusters of mongo databases
        useUnifiedTopology: true,
    }); 
    ***/

    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = { mongoConnect, mongoDisconnect }