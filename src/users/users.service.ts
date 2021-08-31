import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
  ) {}

  getByEmail(email: string) {
    return this.usersRepository.getByEmail(email);
  }

  getById(userId: number) {
    return this.usersRepository.getById(userId);
  }

  create(createUserData: CreateUserDto) {
    return this.usersRepository.create(createUserData);
  }

  async addAvatar(userId: number, imageBuffer: Buffer, fileName: string) {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      fileName,
    );
    await this.usersRepository.addAvatar(userId, avatar);
    return avatar;
  }
}
