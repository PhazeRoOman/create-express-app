import { config } from "dotenv";
config();
import express from "express";
import { PORT } from "./config/constants";

const app = express();
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
