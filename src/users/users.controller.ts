import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../authentication/guards/jwtAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { Express, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  getAllFiles(@Req() req: RequestWithUser) {
    return this.usersService.getAllPrivateFilesPresignedURLs(req.user.id);
  }

  @Get('file/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getFile(
    @Param('id') fileId: number,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const file = await this.usersService.getPrivateFile(fileId, req.user.id);
    file.stream.pipe(res);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  addAvatar(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addAvatar(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Post('file')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  addFile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.addPrivateFile(
      req.user.id,
      file.buffer,
      file.originalname,
    );
  }

  @Delete('file/:id')
  @UseGuards(JwtAuthenticationGuard)
  public deleteFile(@Param('id') fileId: number, @Req() req: RequestWithUser) {
    return this.usersService.deleteFile(fileId, req.user.id);
  }
}
