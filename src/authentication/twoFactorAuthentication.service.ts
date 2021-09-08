import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { UsersService } from '../users/users.service';
import User from '../users/entities/user.entity';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const appName = this.configService.get(
      'TWO_FACTOR_AUTHENTICATION_APP_NAME',
    );

    const otpauthUri = authenticator.keyuri(user.email, appName, secret);

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      otpauthUri,
      secret,
    };
  }

  isTwoFactorAuthenticationCodeValid(token: string, user: User) {
    return authenticator.verify({
      token,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  pipeQrCodeStream(stream: Response, otpauthUri: string) {
    stream.setHeader('content-type', 'image/png');
    return toFileStream(stream, otpauthUri);
  }
}
