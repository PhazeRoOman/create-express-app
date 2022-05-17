const { config } = require("dotenv");
config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookies = require("cors");
const { PORT, AccessControlAllowOrigin } = require("./config/");
const { usersRouter } = require("./routes");
const { errorMiddleware } = require("./middlewares");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies.
app.use(cookies());
// enable cross origin request.
app.use(cors({ origin: AccessControlAllowOrigin }));
// tiny logging.
app.use(morgan("tiny"));

//This is where you should add your different endpoint handlers
app.use("/users", usersRouter);
//Don't remove any of these unless you have to
app.get("/version", (req, res) => res.send(process.env["npm_package_version"]));
app.use("/healthcheck", (req, res) => res.sendStatus(200)); // This is used for health check on load balancer to run task correctly
app.use(/^\/$/, (req, res) => res.sendStatus(200)); // This is used for health check on load balancer to run task correctly
app.use("*", (req, res) => res.status(404).send({ msg: "Undefined" }));
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
