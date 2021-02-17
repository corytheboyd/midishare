const path = require("path");
require("dotenv").config({
  path: process.env.DOTENV_PATH,
});
if (process.env.NODE_ENV === "development") {
  require("ts-node/register");
  require("./src/index");
} else if (process.env.NODE_ENV === "production") {
  require("/home/node/midishare/dist/index.js");
} else {
  throw new Error(`Unexpected NODE_ENV: ${process.env.NODE_ENV}`);
}
