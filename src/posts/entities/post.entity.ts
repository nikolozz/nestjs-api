import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';
import Category from '../../categories/entities/category.entity';
import Comment from '../../comments/entities/comment.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @Column({ type: 'text', array: true, nullable: true })
  public keywords: string[];

  @ManyToOne(
    () => User,
    (user: User) => user.posts,
    { eager: true },
  )
  public author?: User;

  @ManyToMany(
    () => Category,
    (category: Category) => category.posts,
    { eager: true, cascade: true },
  )
  @JoinTable()
  public categories?: Category[];

  @OneToMany(
    () => Comment,
    (comment: Comment) => comment.post,
    { eager: true },
  )
  public comments?: Comment[];
}

export default Post;
