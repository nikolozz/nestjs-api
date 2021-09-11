import {
  Controller,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  Body,
  HttpCode,
} from '@nestjs/common';
import JwtTwoFactorGuard from '../authentication/guards/jwtTwoFactorAuthentication.guard';
import RequestWithUser from '../authentication/interfaces/requestWIthUser.interface';
import { ConfirmVerificationDto } from './dto/confirmVerificationCode.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate-verification')
  @UseGuards(JwtTwoFactorGuard)
  async initiatePhoneNumberVerification(@Req() request: RequestWithUser) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number is already confirmed');
    }
    await this.smsService.initiatePhoneNumberVerification(
      request.user.phoneNumber,
    );
  }

  @Post('confirm-code')
  @HttpCode(200)
  @UseGuards(JwtTwoFactorGuard)
  confirmVerificationCode(
    @Req() request: RequestWithUser,
    @Body() { code }: ConfirmVerificationDto,
  ) {
    const { user } = request;
    if (user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone Number is already confirmed.');
    }
    return this.smsService.confirmVerificationCode(
      user.id,
      user.phoneNumber,
      code,
    );
  }
}
