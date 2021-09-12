import { verifyAccessToken } from "../utilities/token.js";
import { AuthenticationError } from "../utilities/Errors.js";
import asyncHandler from "../utilities/async.js";

const tokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    throw new AuthenticationError(
      "ERR_AUTH_HEADER",
      "authorization header with bearer token is required"
    );
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer")
    throw new AuthenticationError("ERR_TOKEN_TYPE", "Bearer token is required");
  const data = verifyAccessToken(token);
  req.phoneNumber = data.phoneNumber;
  next();
};

export default tokenMiddleware;
