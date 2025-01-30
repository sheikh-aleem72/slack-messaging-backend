import { StatusCodes } from "http-status-codes";

class ClientError extends Error {
  constructor(error) {
    super();
    this.name = "Client Error";
    this.message = error.message;
    this.explanation = error.explanation;
    this.status = error.status ? error.status : StatusCodes.BAD_REQUEST;
  }
}

export default ClientError;
