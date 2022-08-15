const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const planet = require('./planets.mongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

async function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
                relax_quotes: true,
                relax_column_count: true,
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    // habitablePlanets.push(data);

                    savePlanets(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllPlannets()).length;
                console.log(`${countPlanetsFound} habitable planets found!`);
                resolve();
            });
    });
}

async function getAllPlannets() {
    // first parameter is for on which criteria you wanna filter the data
    // the second parameter is for which fields you wanna exclude
    return await planet.find({}, {
        '_id': 0, '__v': 0,
    });
}

async function savePlanets(data) {
    // insert  + update = upsert
    // create adds the data without checking if it already exists or not
    // whereas upsert insert the data if it doesn't already exists...
    // and if it already exists then it updates the data with whatever you pass
    await planet.updateOne({
        keplerName: data.kepler_name,
    }, {
        keplerName: data.kepler_name,
    }, {
        upsert: true
    });
}

module.exports = {
    // planets: habitablePlanets,
    getAllPlannets,
    loadPlanetsData,
}