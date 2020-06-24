/* eslint-disable import/order */
const app = require("./bin/express");

const server = require("http").Server(app);

const port = process.env.PORT || 3333;

server.listen(port);
