import { IsNotEmpty, IsString } from 'class-validator';

export class AddCreditCardDto {
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}
