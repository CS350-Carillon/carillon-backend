/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
          logger.debug(`${socket.id} joined ${channel}`);
          if (channel) {
            socket.join(channel.toString());
          }
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('join', ({ roomId, userId }) => {
      logger.debug(`${socket.id} joined ${roomId}`);
      socket.join(roomId);
      socket.to(roomId).emit('join', {
        userId: userId,
      });
    });

    socket.on('postMessage', async (message) => {
      try {
        logger.debug(`${socket.id} sent message: ${message}`);
        const sender = await User.findById(message.sender);
        if (!sender) {
          new Error(`${message.sender} not found`);
        }

        const chat = new Chat({
          content: message.content,
          channel: message.channel,
          sender: message.sender,
        })
        await chat.save();

        io.to(message.channel).emit('postMessage', await chat.populate('sender'));
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('editMessage', async (message) => {
      try {
        logger.debug(`${message.sender} edit ${message.chatId}`);
        //TODO: sender validation
        const chat = await Chat.findByIdAndUpdate(message.chatId, {
          content: message.content,
        }, {
          new: true,
        }).populate('sender');
        
        io.to(chat!.channel!.toString()).emit('editMessage', chat);
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('deleteMessage', async (message) => {
      try {
        logger.debug(`${message.sender} delete ${message.chatId}`);

        //TODO: 작성자 validation
        const chat = await Chat.findByIdAndUpdate(message.chatId, {
          content: 'This message is removed from the channel',
          isDeleted: true,
        }, {
          new: true,
        }).populate('sender');
        io.to(chat!.channel!.toString()).emit('deleteMessage', chat);
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('addResponse', async (response) => {
      try {
        logger.debug(`${response.sender} respond to ${response.chatId}`);
        const sender = await User.findById(response.sender);
        if (!sender) {
          new Error(`${response.sender} not found`);
        }

        const chat = new Chat({
          content: response.content,
          channel: response.channel,
          sender: response.sender,
        })
        await chat.save();

        //TODO: Validation
        await Chat.findByIdAndUpdate(response.chatId, {
          $push: {
            responses: chat,
          },
        });

        io.to(response.channel).emit('addResponse', {
          response: (await chat.populate('sender')),
          respondedChatId: response.chatId
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('addReaction', async (reaction) => {
      try {
        logger.debug(`${reaction.reactor} reaction to ${reaction.chatId}`);
        const reactor = await User.findById(reaction.reactor);
        if (!reactor) {
          new Error(`${reaction.reactor} not found`);
        }

        const createdReaction = new Reaction({
          reactionType: reaction.reactionType,
          reactor: reaction.reactor,
        });
        await createdReaction.save();

        //TODO: Validation
        const chat = await Chat.findById(reaction.chatId);
        if (!chat || !chat.channel) {
          throw new Error(`Channel not found`);
        }

        await Chat.findByIdAndUpdate(reaction.chatId, {
          $push: {
            reactions: createdReaction,
          },
        });

        io.to(chat.channel.toString()).emit('addReaction', {
          reaction: await createdReaction.populate('reactor'),
          chatId: chat._id,
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });

    socket.on('deleteReaction', async (reaction) => {
      try {
        logger.debug(`${reaction.reactor} delete reaction: ${reaction.reactionId}`);
        const reactor = await User.findById(reaction.reactor);
        if (!reactor) {
          new Error(`${reaction.reactor} not found`);
        }

        const deletedReaction = await Reaction.findOneAndDelete({
          _id: reaction.reactionId,
          reactor: reaction.reactor,
        })


        //TODO: Validation
        const chat = await Chat.findById(reaction.chatId);
        if (!chat || !chat.channel) {
          throw new Error(`Channel not found`);
        }

        await Chat.findByIdAndUpdate(reaction.chatId, {
          $pull: {
            reactions: reaction.reactionId,
          },
        });

        io.to(chat.channel.toString()).emit('deleteReaction', {
          reaction: await deletedReaction!.populate('reactor'),
          chatId: chat._id,
        });
      } catch (error: any) {
        logger.error(error.message);
      }
    });
  });
}
