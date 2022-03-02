const errorHandle = (err, req, res, next) => {
  res.status(500).json({
    error: true,
    name: err.name,
    message: err.message,
  });
};
export default errorHandle;
