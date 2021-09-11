import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import RequestWithUser from '../interfaces/requestWIthUser.interface';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { user }: RequestWithUser = context.switchToHttp().getRequest();
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email is not confirmed');
    }
    return true;
  }
}
