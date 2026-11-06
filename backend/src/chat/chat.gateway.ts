import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado al chat: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado del chat: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { senderId: string; receiverId: string; message: string },
  ) {
    try {
      const savedMessage = await this.prisma.chatMessage.create({
        data: {
          senderId: payload.senderId,
          receiverId: payload.receiverId,
          message: payload.message,
        },
      });

      // Emisión del mensaje a la sala de chat
      this.server.emit(`chat_${payload.receiverId}`, savedMessage);
      this.server.emit(`chat_${payload.senderId}`, savedMessage);

      return savedMessage;
    } catch (err: any) {
      this.logger.error(`Error al procesar mensaje de socket: ${err.message}`);
      return { error: 'No se pudo guardar el mensaje' };
    }
  }
}
