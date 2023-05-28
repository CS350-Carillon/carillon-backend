/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import logger from "./util/logger";
import { Chat, User } from "./schemas";

export function startServer(io: Server) {
  io.on("connection", (socket) => {
    logger.info(`Connected to websocket ${socket.id}`);
    
    socket.on("init", async (data) => {
      try {
        logger.debug(`${data.userId} initially join all rooms`);
        const user = await User.findById(data.userId);
        if (!user) {
          throw new Error(`${data.userId} not found`);
        }

        const channels = user.participatingChannels;
        channels.forEach((channel) => {
          if (channel) {
            socket.join(channel.toString())
          }
        })
      } catch (error: any) {
        logger.error(error.message);
      }
    })

    socket.on("join", (roomId) => {
      logger.debug(`${socket.id} joined ${roomId}`);
      socket.join(roomId);
    })

    socket.on("postMessage", async (message) => {
      try {
        await Chat.create({
          content: message.content,
          channel: message.channel,
          sender: message.sender,
        });
        socket.to(message.channel.toString()).emit(message.content);
      } catch (error: any) {
        logger.error(error.message);
      }
    })
  });
}
