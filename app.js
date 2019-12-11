const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/playlist", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once("open", () => {
  console.log("database is connected");
});

app.use("*", cors());

app.use(
  "/graphql",
  cors(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

// Up and Running at Port 4000
app.listen("5000", () => {
  console.log("API server is running");
});
