import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmVerificationDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
