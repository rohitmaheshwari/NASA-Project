const express = require('express');

const { httpGetAllPlannets } = require('./plannets.controller');

const plannetRouter = express.Router();

plannetRouter.get('/', httpGetAllPlannets);

module.exports = plannetRouter;