const { config } = require("dotenv");
config();
const express = require("express");
const { PORT } = require("./config/constants");

const app = express();
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
