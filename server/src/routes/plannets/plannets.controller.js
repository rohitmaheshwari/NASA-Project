// const { planets } = require("../../models/plannets.model");
const { getAllPlannets } = require("../../models/plannets.model");

// status 200 is sent by default but still we written it so we can send the appropriate statuscode for other type of responses
// return used so it can send the response once and we won't get any error that the header is already set
const httpGetAllPlannets = async (req, res) => {
    return res.status(200).json(await getAllPlannets());
}

module.exports = {
    httpGetAllPlannets,
}