import express from 'express';
import 'dotenv/config';
import { connectToDb } from './helpers/connectToDb.js';
import routers from './routers/index.js';
import errorHandle from './middlewares/errors/errorHandle.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
var __dirname = path.resolve();

import socket from './services/socket.js';

//server
const app = express();

//parser for express
app.use(express.json());

//cors
app.use(cors());

//socket
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});
// io.on("connection", (socket) => {
//   socket.on("chat", (message) => {
//     io.emit("chat", message);
//     console.log(message);
//   });
// });
//routes
app.use(routers);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
connectToDb();

app.use(errorHandle);

server.listen(process.env.PORT || 3004, () => {
  console.log(`Server started running on port ${process.env.PORT}`);
  socket({ io });
});
