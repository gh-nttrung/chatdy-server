import { Server, Socket } from "socket.io";
import { MessageItem } from "../models/message.model";

interface JoinSocketProps {
  chat_id: string;
  user_id: string;
}

interface NewChatProps {
  chat_id: string;
  message: MessageItem;
}

export default function handlerEventSocket(io: Server, socket: Socket) {
  //
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on("online", ({ chat_id, user_id }: JoinSocketProps) => {
    console.log(`${user_id} join to ${chat_id}`)
    socket.join(chat_id);
  });

  socket.on("new_message", async ({ chat_id, message }: NewChatProps) => {
    socket.broadcast
      .to(`${chat_id}`)
      .emit("new_message", { ...message, isMe: false } as MessageItem);
  });

  //
}
