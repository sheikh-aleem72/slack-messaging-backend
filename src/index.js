// import bullServerAdapter from "./config/billBoardConfig.js";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

import connectDB from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";
import channelSocketHandlers from "./controllers/channelSocketController.js";
import messageSocketHandlers from "./controllers/messageSocketController.js";
import { verifyEmailController } from "./controllers/userController.js";
import apiRouter from "./routes/apiRouter.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/ui", bullServerAdapter.getRouter());

app.use("/api", apiRouter);
app.get("/verify/:token", verifyEmailController);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // socket.on("messageFromClient", (data) => {
  //   console.log("Message from client", data);

  //   io.emit("new message", data.toUpperCase()); // broasdcast
  // });
  messageSocketHandlers(io, socket);
  channelSocketHandlers(io, socket);
});

app.get("/ping", (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: "pong",
  });
});

server.listen(PORT, async () => {
  console.log("Server is listening on PORT:", PORT);
  connectDB();
});
