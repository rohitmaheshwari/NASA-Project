const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');
const { getPagination } = require('../../services/query')

const httpGetAllLaunches = async (req, res) => {
    // map objects aren't javascript object notation
    // so we can use map.values and pass it in Array object

    const { skip, limit } = getPagination(req.query);
    return res.status(200).json(await getAllLaunches(skip, limit));
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property!',
        });
    }

    // when we check date is NaN, it gets like date.valueOf()
    // date.valueOf() gives the timestamp of it
    launch.launchDate = new Date(launch.launchDate);
    // if(launch.launchDate.toString() === 'Invalid Date')
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    }

    scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = +req.params.id;
    // const launchId = Number(req.params.id);

    const existLaunch = await existsLaunchWithId(launchId);
    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch not found!',
        });
    }

    const aborted = abortLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted!',
        });
    }
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}