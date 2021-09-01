import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  SerializeOptions,
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

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
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
}
