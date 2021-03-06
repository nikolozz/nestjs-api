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
  public email: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public phoneNumber: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ nullable: true })
  @Exclude()
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({ default: false })
  public isEmailVerified: boolean;

  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @Column()
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  public stripeCustomerId: string;

  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;

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
