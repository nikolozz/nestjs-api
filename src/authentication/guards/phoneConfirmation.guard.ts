import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import RequestWithUser from '../interfaces/requestWIthUser.interface';

@Injectable()
export class PhoneNumberVerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const { user }: RequestWithUser = context.switchToHttp().getRequest();
    if (!user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone Number is not confirmed.');
    }
    return true;
  }
}
