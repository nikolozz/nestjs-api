import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { UsersService } from '../users/users.service';

@Injectable()
export class SmsService {
  private readonly twilioClient: Twilio;
  private readonly serviceSid = this.configService.get(
    'TWILIO_VERIFICATION_SERVICE_SID',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const accountSid = configService.get('TWILIO_ACCOUNT_SID');
    const authToken = configService.get('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  initiatePhoneNumberVerification(phoneNumber: string) {
    return this.twilioClient.verify
      .services(this.serviceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
  }

  async confirmVerificationCode(
    userId: number,
    phoneNumber: string,
    verificationCode: string,
  ) {
    const result = await this.twilioClient.verify
      .services(this.serviceSid)
      .verificationChecks.create({ to: phoneNumber, code: verificationCode });

    if (!result.valid || result.status !== 'approved') {
      throw new BadRequestException('Wrong code provided');
    }

    await this.usersService.markPhoneNumberAsConfirmed(userId);
  }
}
