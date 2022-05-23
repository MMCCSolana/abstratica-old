/* eslint-disable no-console */
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const enforce = require("express-sslify");
const fallback = require("express-history-api-fallback");
const root = path.join(__dirname, "/dist");
// configs
const PORT = process.env.PORT || 8000;
const ssl = process.env.ssl || false;
// init
const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
const server = require("http").createServer(app);
server.listen(PORT);
console.log(`${new Date()} - App started on ${PORT}...`);

// middlewares
if (ssl) {
  console.log("use ssl");
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use(require("./server/middlewares/compress"));
app.use(require("./server/middlewares/cors"));
app.use(require("./server/middlewares/static")(root));
app.use(fallback("index.html", { root: root }));
