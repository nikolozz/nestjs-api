import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PublicFile from './entities/publicFile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(PublicFile)
    private readonly filesRepository: Repository<PublicFile>,
  ) {}

  async createPublicFile(url: string, key: string) {
    const newFile = this.filesRepository.create({
      url,
      key,
    });
    await this.filesRepository.save(newFile);
    return newFile;
  }
}
