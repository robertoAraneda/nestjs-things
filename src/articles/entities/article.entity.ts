import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../globals/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('articles')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Exclude()
  @Column({ name: 'identifier_value' })
  identifierValue: string;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @RelationId((article: Article) => article.user)
  userId: string;

  constructor(partial: Partial<Article>) {
    super();
    Object.assign(this, partial);
  }
}
