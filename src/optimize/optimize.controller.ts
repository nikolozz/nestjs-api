import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { Readable } from 'stream';

@Controller('optimize')
export class OptimizeController {
  constructor(@InjectQueue('image') private readonly imageQueue: Queue) {}

  @Post('images')
  @UseInterceptors(AnyFilesInterceptor())
  async processImages(@UploadedFile() files: Express.Multer.File[]) {
    const job = await this.imageQueue.add('optimize', { files });
    return {
      jobId: job.id,
    };
  }

  @Get('image/:id')
  async getJobResult(@Param('id') jobId: number, @Res() response: Response) {
    const job = await this.imageQueue.getJob(jobId);
    if (!job) {
      return response.status(HttpStatus.NOT_FOUND).send();
    }
    const isJobCompleted = job.isCompleted();
    if (!isJobCompleted) {
      return response.status(HttpStatus.CONTINUE).send();
    }
    const result = Buffer.from(job.returnvalue);
    const stream = Readable.from(result);
    stream.pipe(response);
  }
}
