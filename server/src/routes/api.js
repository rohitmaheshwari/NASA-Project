const express = require('express');

const plannetRouter = require('./plannets/plannets.router');
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

api.use('/planets', plannetRouter);
api.use('/launches', launchesRouter);

module.exports = api;