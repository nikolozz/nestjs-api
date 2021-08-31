import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getAllPrivateFilesPresignedURLs(userId: number) {
    const userWithFiles = await this.usersRepository.getAllPrivateFiles(userId);
    if (!userWithFiles.files) {
      throw new NotFoundException(userId);
    }
    const generatedPresignedUrls = userWithFiles.files.map(file =>
      this.filesService.generatePresignedUrl(file.key),
    );
    const presignedURLs = await Promise.all(generatedPresignedUrls);
    return presignedURLs;
  }

  async getPrivateFile(fileId: number, ownerId: number) {
    const file = await this.filesService.getPrivateFile(fileId);
    if (file.info.owner.id !== ownerId) {
      throw new NotFoundException(fileId);
    }
    return file;
  }

  addPrivateFile(userId: number, fileBuffer: Buffer, filename: string) {
    return this.filesService.uploadPrivateFile(fileBuffer, userId, filename);
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

  async deleteFile(fileId: number, ownerId: number) {
    return this.filesService.deletePrivateFile(fileId, ownerId);
  }
}
