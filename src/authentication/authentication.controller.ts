import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './interfaces/requestWIthUser.interface';
import { Response } from 'express';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { UsersService } from '../users/users.service';
import { JwtRefreshGuard } from './guards/jwtRefreshGuard.guard';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationDto } from './dto/twoFactorAuthentication.dto';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }

  @Post('register')
  register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    const accessToken = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    const {
      cookie,
      token,
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setJwtRefreshToken(user.id, token);
    request.res.setHeader('Set-Cookie', [accessToken, cookie]);
    return user;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = await this.authenticationService.getCookieWithJwtToken(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.usersService.removeJwtRefreshToken(request.user.id);
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @Post('2fa-generate')
  @UseGuards(JwtAuthenticationGuard)
  public async generateTwoAuth(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    const {
      otpauthUri,
    } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
      request.user,
    );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUri,
    );
  }

  @Post('2fa-turn-on')
  @UseGuards(JwtAuthenticationGuard)
  public async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { secret }: TwoFactorAuthenticationDto,
  ) {
    const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      secret,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('2fa-authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async authenticateTwoFactor(
    @Req() request: RequestWithUser,
    @Body() { secret }: TwoFactorAuthenticationDto,
  ) {
    const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      secret,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const accessTokenCookie = await this.authenticationService.getCookieWithJwtToken(
      request.user.id,
      { isSecondFactorAuthenticated: true },
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }
}
