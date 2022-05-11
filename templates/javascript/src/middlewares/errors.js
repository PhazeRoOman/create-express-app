module.exports = {
  errorMiddleware: (err, req, res) => {
    console.error(err.stack);
    res.status(500).send({
      msg: "Something broke!, contact system admin",
      err: err.message,
    });
  },
};
