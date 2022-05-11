import { Response, Request } from "express";
const errorMiddleware = (err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send({
    msg: "Something broke!, contact system admin",
    err: err.message,
  });
};
export { errorMiddleware };
