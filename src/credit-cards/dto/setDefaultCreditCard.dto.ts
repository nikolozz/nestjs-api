import { IsNotEmpty, IsString } from 'class-validator';

export class SetDefaultCreditCardDto {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}
