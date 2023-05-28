/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import logger from './util/logger';
import { Chat, Reaction, User } from './schemas';

export function startServer(io: Server) {
  io.on('connection', (socket) => {
    logger.info(`Connected to websocket ${socket.id}`);

    socket.on('init', async (data) => {
      try {
        logger.debug(`${data.userId} initially join all rooms`);
        const user = await User.findById(data.userId);
        if (!user) {
          throw new Error(`${data.userId} not found`);
        }

        const channels = user.participatingChannels;
        channels.forEach((channel) => {
          if (channel) {
            socket.join(channel.toString());
          }
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('join', (roomId) => {
      logger.debug(`${socket.id} joined ${roomId}`);
      socket.join(roomId);
    });

    socket.on('postMessage', async (message) => {
      try {
        const sender = await User.findById(message.sender);
        if (!sender) {
          new Error(`${message.sender} not found`);
        }

        await Chat.create({
          content: message.content,
          channel: message.channel,
          sender: message.sender,
        });
        socket.to(message.channel.toString()).emit('postMessage', {
          sender: sender?.userName,
          content: message.content,
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('editMessage', async (message) => {
      try {
        await Chat.findByIdAndUpdate(message.id, {
          content: message.content,
        });
        socket.to(message.channel.toString()).emit('editMessage', {
          messageId: message.id,
          content: message.content,
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('deleteMessage', async (message) => {
      try {
        await Chat.findByIdAndUpdate(message.id, {
          content: 'This message is removed from the channel',
        });
        socket.to(message.channel.toString()).emit('deleteMessage', {
          messageId: message.id,
          content: 'This message is removed from the channel',
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('addResponse', async (response) => {
      try {
        const sender = await User.findById(response.sender);
        if (!sender) {
          new Error(`${response.sender} not found`);
        }

        const chat = await Chat.create({
          content: response.content,
          channel: response.channel,
          sender: response.sender,
        });

        //TODO: Validation
        await Chat.findByIdAndUpdate(response.chatId, {
          $push: {
            responses: chat,
          },
        });

        socket.to(response.channel.toString()).emit('addResponse', {
          chatId: response.chatId, // This is the id of the chat that the response is for.
          sender: sender?.userName,
          content: response.content,
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('addReaction', async (reaction) => {
      try {
        const reactor = await User.findById(reaction.reactor);
        if (!reactor) {
          new Error(`${reaction.reactor} not found`);
        }

        const createdReaction = await Reaction.create({
          reactionType: reaction.reactionType,
          reactor: reaction.reactor,
        });

        //TODO: Validation
        const chat = await Chat.findById(reaction.chatId);
        if (!chat || !chat.channel) {
          return new Error(`Channel not found`);
        }

        await Chat.findByIdAndUpdate(reaction.chatId, {
          $push: {
            reactions: createdReaction,
          },
        });

        socket.to(chat.channel.toString()).emit('addReaction', {
          chatId: reaction.chatId, // This is the id of the chat that the response is for.
          sender: reactor?.userName,
          reactionType: reaction.reactionType,
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });
  });
}
