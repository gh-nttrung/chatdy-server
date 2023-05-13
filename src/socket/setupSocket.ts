import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { instrument } from "@socket.io/admin-ui";

import handlerEventSocket from "./eventSocketHandler";

interface SocketAuth {
  token?: string;
}

export default function setupSocket(server: HTTPServer) {
  try {
    console.log("Starting setup Socket");

    const serverOptions = {
      cors: {
        // origin: ["http://localhost:5174", "https://admin.socket.io", "http://localhost:3000"],
        origin: ["https://admin.socket.io"],
        credentials: true,
      },
    };
    const io = new Server(server, serverOptions);

    instrument(io, {
      auth: false,
      mode: "development",
    });

    // io.use((socket, next) => {
    //   const socketAuth = socket.handshake.auth as SocketAuth;
    //   if (socketAuth && socketAuth.token) {
    //     const jwtSecretKey = process.env.JWT_SECRET_KEY as string;

    //     // Verify the token using the secret key
    //     jwt.verify(socketAuth.token, jwtSecretKey, (err, _) => {
    //       if (err) {
    //         new Error("Error auth!");
    //       }
    //       next();
    //     });
    //   } else {
    //     next(new Error("Error auth!"));
    //   }
    // });

    io.on("connection", (socket: Socket) => {
      console.log(`User ${socket.id} has joined`)
      handlerEventSocket(io, socket);
    });

    io.on("error", (error) => {
      console.log("Error:", error);
    });

    console.log("Finished setup Socket");
  } catch (error) {
    throw error;
  }
}
