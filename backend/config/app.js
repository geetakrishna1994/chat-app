import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { PageNotFoundError } from "../utilities/Errors.js";
//routers
import authRouter from "../routes/auth.js";

//initialize app
const app = express();

//middleware
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

// routes

app.use("/auth", authRouter);

app.use("*", (req, res, next) => {
  throw new PageNotFoundError();
});

app.use((err, req, res, next) => {
  console.log(err);
  const { status, code, message } = err;
  res.status(status).json({
    code,
    message,
  });
});

export default app;
