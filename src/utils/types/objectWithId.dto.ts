import { IsNotEmpty } from 'class-validator';

export class ObjectWithId {
  @IsNotEmpty()
  id: number;
}
