// making server with built in http has many benefits
// like with this we can easily commuincate with http request and also web sockets
const http = require("http");

require('dotenv').config();

const app = require('./app');

const { mongoConnect } = require('./services/mongo');

const { loadPlanetsData } = require('./models/plannets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();