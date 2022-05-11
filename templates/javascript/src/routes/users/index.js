const { Router } = require("express");
const router = Router();
router.get("/", (req, res) => {
  const users = ["user1", "user2"];
  res.send(users);
});
module.exports = { usersRouter: router };
