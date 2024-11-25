export const internalServerErrror = (error) => {
  return {
    success: false,
    err: error,
    data: {},
    message: "Some internal server error",
  };
};

export const errorReponse = (error) => {
  if (!error.message && !error.explanation) {
    return internalServerErrror(error);
  }
  return {
    success: false,
    err: error,
    data: {},
    message: error.message,
  };
};

export const successResponse = (data, message) => {
  return {
    success: true,
    data,
    err: {},
    message,
  };
};
