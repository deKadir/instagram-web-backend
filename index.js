import express from "express";
import "dotenv/config";
import { connectToDb } from "./helpers/connectToDb.js";
import routers from "./routers/index.js";
import errorHandle from "./middlewares/errors/errorHandle.js";
import cors from "cors";

//server
const app = express();

//parser for express
app.use(express.json());

//cors
app.use(cors());

app.use(routers);
app.get("/", (req, res) => {
  res.send("Server is running...");
});
connectToDb();

app.use(errorHandle);

app.listen(process.env.PORT || 3004, () => {
  console.log(`Server started running on port ${process.env.PORT}`);
});
