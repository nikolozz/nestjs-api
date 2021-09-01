import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './adress.entity';
import Post from '../../posts/entities/post.entity';
import PublicFile from '../../files/entities/publicFile.entity';
import PrivateFile from '../../files/entities/privateFile.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public name: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column()
  @Exclude()
  public password: string;

  @OneToOne(() => Address, { eager: true, cascade: true })
  @JoinColumn()
  public adress: Address;

  @OneToOne(() => PublicFile, { eager: true, nullable: true })
  @JoinColumn()
  public avatar: PublicFile;

  @OneToMany(
    () => Post,
    (post: Post) => post.author,
  )
  public posts: Post[];

  @OneToMany(
    () => PrivateFile,
    (file: PrivateFile) => file.owner,
  )
  public files: PrivateFile[];
}

export default User;
