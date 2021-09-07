import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column('text')
  public content: string;

  @ManyToOne(() => User)
  public author: User;
}

export default Message;
