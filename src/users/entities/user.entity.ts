import { Article } from '../../articles/entities/article.entity';
import { BaseEntity } from '../../globals/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  given: string;

  @Column()
  family: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  constructor(partial: Partial<User>) {
    super();

    Object.assign(this, partial);
  }
}
