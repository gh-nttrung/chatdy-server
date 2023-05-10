import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";

import setupSocket from "./socket/setupSocket";
import router from "./routes";

try {
  config();
  const app = express();
  app.use(cors());
  
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
