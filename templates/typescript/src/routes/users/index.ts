import { Router, Request, Response } from "express";
const router = Router();
router.get("/", (req: Request, res: Response) => {
  const users = ["user1", "user2"];
  res.send(users);
});
export { router as usersRouter };
