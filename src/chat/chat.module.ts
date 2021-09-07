import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import Message from './entities/message.entity';
import { WsJwtGuard } from './guards/wsJwtGuard.guard';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), AuthenticationModule],
  providers: [ChatGateway, ChatService, ChatRepository, WsJwtGuard],
})
export class ChatModule {}
