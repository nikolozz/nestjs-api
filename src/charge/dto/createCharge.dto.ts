import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
