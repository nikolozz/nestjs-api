import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class PublicFile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public url: string;

  @Column()
  public key: string;
}

export default PublicFile;
