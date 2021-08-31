import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PublicFile from './entities/publicFile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(PublicFile)
    private readonly filesRepository: Repository<PublicFile>,
  ) {}

  getPublicFile(fileId: number) {
    return this.filesRepository.findOne(fileId);
  }

  async createPublicFile(url: string, key: string) {
    const newFile = this.filesRepository.create({
      url,
      key,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const deleteResponse = await this.filesRepository.delete(fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException(fileId);
    }
  }
}
