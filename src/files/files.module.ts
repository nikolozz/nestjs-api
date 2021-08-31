import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import PublicFile from './entities/publicFile.entity';
import { AwsModule } from '../aws/aws.module';
import { S3 } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import { FilesRepository } from './files.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile]),
    AwsModule.forFeature(S3),
    ConfigModule,
  ],
  providers: [FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
