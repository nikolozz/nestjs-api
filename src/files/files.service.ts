import { Injectable, NotFoundException } from '@nestjs/common';
import S3 = require('aws-sdk/clients/s3');
import { InjectAwsService } from '../aws/decorators/awsService.decorator';
import { FilesRepository } from './files.repository';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { PUBLIC_BUCKET, PRIVATE_BUCKET } from './contants';
import { QueryRunner } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectAwsService(S3) private readonly s3: S3,
    private readonly configService: ConfigService,
    private readonly filesRepository: FilesRepository,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get(PUBLIC_BUCKET),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    const file = await this.filesRepository.createPublicFile(
      uploadResult.Location,
      uploadResult.Key,
    );
    return file;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.filesRepository.getPublicFile(fileId);
    if (!file) {
      throw new NotFoundException(fileId);
    }
    await this.s3
      .deleteObject({
        Bucket: this.configService.get(PUBLIC_BUCKET),
        Key: file.key,
      })
      .promise();
    await this.filesRepository.deletePublicFile(fileId);
  }

  async deletePublicFileWithQueryRunner(
    fileId: number,
    queryRunner: QueryRunner,
  ) {
    const file = await this.filesRepository.getPublicFile(fileId);
    if (!file) {
      throw new NotFoundException(fileId);
    }
    await this.s3
      .deleteObject({
        Bucket: this.configService.get(PUBLIC_BUCKET),
        Key: file.key,
      })
      .promise();
    await this.filesRepository.deletePublicFileWithQueryRunner(
      fileId,
      queryRunner,
    );
  }

  async getPrivateFile(fileId: number) {
    const privateFile = await this.filesRepository.getPrivateFile(fileId);
    if (!privateFile) {
      throw new NotFoundException(fileId);
    }
    const stream = await this.s3
      .getObject({
        Bucket: this.configService.get(PRIVATE_BUCKET),
        Key: privateFile.key,
      })
      .createReadStream();

    return {
      stream,
      info: privateFile,
    };
  }

  generatePresignedUrl(key: string) {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: this.configService.get(PRIVATE_BUCKET),
      Key: key,
    });
  }

  async uploadPrivateFile(
    dataBuffer: Buffer,
    ownerId: number,
    filename: string,
  ) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.configService.get(PRIVATE_BUCKET),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    const newPrivateFile = await this.filesRepository.createPrivateFile(
      uploadResult.Location,
      uploadResult.Key,
      ownerId,
    );
    return newPrivateFile;
  }

  async deletePrivateFile(fileId: number, ownerId: number) {
    const file = await this.filesRepository.getPrivateFile(fileId);
    if (file?.owner.id !== ownerId) {
      throw new NotFoundException(fileId);
    }
    await Promise.all([
      this.filesRepository.deletePrivateFile(fileId),
      this.s3.deleteObject({
        Bucket: this.configService.get(PRIVATE_BUCKET),
        Key: file.key,
      }),
    ]);
    return file;
  }
}
