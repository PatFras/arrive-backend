const handleErrors = (errors) => {
  return errors.array().map((error) => ({
    field: error.param,
    message: error.msg,
  }));
};

module.exports = { handleErrors };
