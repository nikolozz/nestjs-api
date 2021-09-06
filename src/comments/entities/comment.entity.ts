import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import Post from '../../posts/entities/post.entity';
import User from '../../users/entities/user.entity';

@Entity()
class Comment {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ type: 'text' })
  public content: string;

  @ManyToOne(
    () => Post,
    (post: Post) => post.comments,
  )
  public post: Post;

  @ManyToOne(
    () => User,
    (user: User) => user.posts,
  )
  public author: User;
}

export default Comment;
