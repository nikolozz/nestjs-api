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
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { Express, Response } from 'express';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import { EmailConfirmationGuard } from '../authentication/guards/emailConfirmation.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('files')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  getAllFiles(@Req() req: RequestWithUser) {
    return this.usersService.getAllPrivateFilesPresignedURLs(req.user.id);
  }

  @Get('file/:id')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  async getFile(
    @Param('id') fileId: number,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    const file = await this.usersService.getPrivateFile(fileId, req.user.id);
    file.stream.pipe(res);
  }

  @Post('avatar')
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
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
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
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
  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtTwoFactorGuard)
  public deleteFile(@Param('id') fileId: number, @Req() req: RequestWithUser) {
    return this.usersService.deleteFile(fileId, req.user.id);
  }
}
