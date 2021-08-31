import { CreateUserDto } from './createUser.dto';
import PublicFile from '../../files/entities/publicFile.entity';

export class UpdateUserDto extends CreateUserDto {
  avatar: PublicFile;
}
