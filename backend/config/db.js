import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("connected", () => console.log("MONGO DB Connected"));

db.on("error", (err) => console.log(err));

export default db;
