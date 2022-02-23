const errorHandle = (err, req, res, next) => {
  res.status(err.code || 500).json({
    error: true,
    code: err.code,
    name: err.name,
    message: err.message,
  });
};
export default errorHandle;
