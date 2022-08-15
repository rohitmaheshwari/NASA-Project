const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

// let latestFlightNumber = 100;

// const launch = {
//     flightNumber: 100, //flight_number
//     mission: 'Kepler Exploration X', // name
//     rocket: 'Explorer IS1', // rocket.name
//     launchDate: new Date('December 27, 2030'), // date_local
//     target: 'Kepler-442 b', // not applicable
//     customers: ['ZTM', 'NASA'], // payload.customers for each payload
//     upcoming: true, // upcoming 
//     success: true, // success
// }

// launches.set(launch.flightNumber, launch);

// saveLaunch(launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log('Downloading launches data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1,
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs;
    launchDocs.forEach(launchDoc => {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            // customers: customers,
            customers, // shorthand for customers: customers
        }

        console.log(`${launch.flightNumber} ${launch.mission}`);

        saveLaunch(launch);
    });
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1',
    });
    if (firstLaunch) {
        return;
    }

    await populateLaunches();
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumer'); // sorted in desc order

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function existsLaunchWithId(id) {
    return await launchesDatabase.findOne({
        flightNumber: id,
    });
}

async function getAllLaunches(skip, limit) {
    // return Array.from(launches.values());
    return await launchesDatabase
        .find({}, { '__v': 0, '_id': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch) {
    // await launchesDatabase.updateOne({
    await launchesDatabase.findOneAndUpdate({ // returns the information only which is updated
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet) {
        throw new Error('No matching planet found!');
    }


    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Nonu', 'Lucha'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customers: ['Nonu', 'Lucha'],
//             flightNumber: latestFlightNumber,
//         })
//     );
// }

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;

    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}

module.exports = {
    loadLaunchesData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}