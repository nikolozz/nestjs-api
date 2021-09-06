import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import Post from '../../posts/entities/post.entity';
import User from '../../users/entities/user.entity';

@Entity()
@Tree('closure-table', {
  closureTableName: 'comment_closure',
})
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

  @TreeChildren()
  public replies: Comment[];

  @TreeParent({ onDelete: 'CASCADE' })
  public parent: Comment;
}

export default Comment;
