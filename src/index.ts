import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import { ConnectOptions, connect, set } from "mongoose";

import setupSocket from "./socket/setupSocket";
import router from "./routes";

try {
  config();
  const app = express();
  app.use(cors());

  //Mongoose
  set("strictQuery", true);
  const connectOptions = { dbName: `${process.env.DB_NAME}` } as ConnectOptions;
  connect(`${process.env.MONGO_URI}`, connectOptions);
  console.info("Successfully connected to MongoDB.");

  //Router
  app.use(router);

  //Socket
  const server = http.createServer(app);
  setupSocket(server);

  //Server listen
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`Server running at port: ${port}`);
  });
} catch (error) {
  console.error(error);
  // process.exit(1);
}
