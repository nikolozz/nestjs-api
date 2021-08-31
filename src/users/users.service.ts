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
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.usersRepository.update(userId, { ...user, avatar: null });
      await this.filesService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      fileName,
    );
    await this.usersRepository.update(userId, { ...user, avatar });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.usersRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }
}
