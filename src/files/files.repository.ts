import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PublicFile from './entities/publicFile.entity';
import { Repository } from 'typeorm';
import PrivateFile from './entities/privateFile.entity';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(PublicFile)
    private readonly filesRepository: Repository<PublicFile>,
    @InjectRepository(PrivateFile)
    private readonly privateFilesRepository: Repository<PrivateFile>,
  ) {}

  getPublicFile(fileId: number) {
    return this.filesRepository.findOne(fileId);
  }

  getPrivateFile(fileId: number) {
    return this.privateFilesRepository.findOne(fileId, {
      relations: ['owner'],
    });
  }

  async createPublicFile(url: string, key: string) {
    const newFile = this.filesRepository.create({
      url,
      key,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }

  async createPrivateFile(url: string, key: string, ownerId: number) {
    const newPrivateFile = await this.privateFilesRepository.create({
      url,
      key,
      owner: {
        id: ownerId,
      },
    });
    await this.privateFilesRepository.save(newPrivateFile);
    return newPrivateFile;
  }

  async deletePublicFile(fileId: number) {
    const deleteResponse = await this.filesRepository.delete(fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(fileId);
    }
  }

  async deletePrivateFile(fileId: number) {
    const deleteResponse = await this.privateFilesRepository.delete(fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(fileId);
    }
  }
}
