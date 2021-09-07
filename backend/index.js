import "./config/env.js";
import db from "./config/db.js";
import app from "./config/app.js";
import { createServer } from "http";

const server = createServer(app);
const port = process.env.PORT;

server.listen(port, console.log(`listening on ${port}`));
