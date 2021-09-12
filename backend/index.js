import "./config/env.js";
import db from "./config/db.js";
import app from "./config/app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import socketHandler from "./config/socket.js";

const server = createServer(app);
const port = process.env.PORT;
server.listen(port, console.log(`listening on ${port}`));

const io = new Server(server, {
  cors: "http://localhost:3000/",
});
const socketMap = new Map();
app.set("io", io);
app.set("socketMap", socketMap);
socketHandler(io, socketMap);
