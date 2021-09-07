import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { ChatRepository } from './chat.repository';
import { AuthenticationService } from '../authentication/authentication.service';
import User from '../users/entities/user.entity';
import { PaginationParams } from '../utils/types/paginationParams';

@Injectable()
export class ChatService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly chatRepository: ChatRepository,
  ) {}

  async saveMessage(message: string, author: User) {
    return this.chatRepository.saveMessage(message, author);
  }

  async getMessages(pagination: PaginationParams) {
    return this.chatRepository.getMessages(pagination);
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authenticationService.getUserFromCookie(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid Credentials');
    }
    return user;
  }
}
