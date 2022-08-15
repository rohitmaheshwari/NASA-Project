const express = require("express");
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/v1', api);

// '*' after '/' means that when we pass anything after '*' it matches first in router
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;