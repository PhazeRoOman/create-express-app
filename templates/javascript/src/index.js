const { config } = require("dotenv");
config();
const express = require("express");
const { PORT } = require("./config/");

const app = express();
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
