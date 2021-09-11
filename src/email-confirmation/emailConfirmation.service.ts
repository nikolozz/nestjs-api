import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { VerificationTokenPayloadInterface } from './interface/verificationToken.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { TokenExpiredException } from './exception/tokenExpired.exception';
import { UsersService } from '../users/users.service';

@Injectable()
export class EmailConfirmationService {
  private readonly secret: string = this.configService.get(
    'JWT_VERIFICATION_TOKEN_SECRET',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  sendVerificationLink(email: string) {
    const payload: VerificationTokenPayloadInterface = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.secret,
      expiresIn: this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      ),
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;
    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.emailService.sendMail({
      text,
      to: email,
      subject: 'Email Confirmation',
    });
  }

  verifyEmail(token: string) {
    const email = this.decodeToken(token);
    return this.usersService.markEmailAsConfirmed(email);
  }

  async resendVerifyEmail(id: number) {
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email already confirmed');
    }
    return this.sendVerificationLink(user.email);
  }

  private decodeToken(token: string) {
    try {
      const payload: VerificationTokenPayloadInterface = this.jwtService.verify(
        token,
        { secret: this.secret },
      );
      if (!payload?.email) {
        throw new BadRequestException();
      }
      return payload.email;
    } catch (error) {
      if (error.code === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }
      throw new BadRequestException(JSON.stringify(error));
    }
  }
}
