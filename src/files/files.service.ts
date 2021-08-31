import { Injectable } from '@nestjs/common';
import S3 = require('aws-sdk/clients/s3');
import { InjectAwsService } from 'src/aws/decorators/awsService.decorator';
import { FilesRepository } from './files.repository';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

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
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
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
}
