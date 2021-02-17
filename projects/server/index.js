require("dotenv").config({
  path: process.env.DOTENV_PATH,
});
if (process.env.NODE_ENV === "development") {
  require("ts-node/register");
  require("./src/index");
} else if (process.env.NODE_ENV === "production") {
  // require("/home/node/dist/server/index.js");
  console.log("hahahah run prod");
} else {
  throw new Error(`Unexpected NODE_ENV: ${process.env.NODE_ENV}`);
}
