import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class PrivateFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;

  @ManyToOne(
    () => User,
    (user: User) => user.files,
  )
  public owner: User;
}

export default PrivateFile;
