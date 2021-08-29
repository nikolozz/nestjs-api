import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';
import Category from '../../categories/entities/category.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(
    () => User,
    (user: User) => user.posts,
    { eager: true },
  )
  public author: User;

  @ManyToMany(
    () => Category,
    (category: Category) => category.posts,
    { eager: true, cascade: true },
  )
  @JoinTable()
  public categories: Category[];
}

export default Post;
