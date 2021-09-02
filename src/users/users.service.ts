import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { FilesService } from '../files/files.service';
import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly filesService: FilesService,
    private readonly connection: Connection,
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
      await this.deleteAvatar(userId);
    }
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      fileName,
    );
    await this.usersRepository.update(userId, { ...user, avatar });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const queryRunner = await this.connection.createQueryRunner();

    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (!fileId) {
      throw new NotFoundException(fileId);
    }

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.usersRepository.deleteAvatarWithQueryRunner(
        user.id,
        queryRunner,
      );
      await this.filesService.deletePublicFileWithQueryRunner(
        user.avatar.id,
        queryRunner,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException({
        message: `Transaction Failed ${error}`,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFile(fileId: number, ownerId: number) {
    return this.filesService.deletePrivateFile(fileId, ownerId);
  }

  setJwtRefreshToken(userId: number, token: string) {
    return this.usersRepository.setJwtRefreshToken(userId, token);
  }

  async getUserFromRefreshToken(userId: number, token: string) {
    const user = await this.getById(userId);
    const isRefreshTokenMatches = await bcrypt.compare(
      token,
      user.currentHashedRefreshToken,
    );
    if (!isRefreshTokenMatches) {
      throw new UnauthorizedException(userId);
    }
    return user;
  }

  removeJwtRefreshToken(userId: number) {
    return this.usersRepository.removeJwtRefreshToken(userId);
  }
}
