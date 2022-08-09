import { BaseEntity } from '../../globals/base.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActionEnum, SubjectEnum } from '../../casl/casl.type';
import { RoleEntity } from '../../roles/entities/role.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ActionEnum })
  action: ActionEnum;

  @Column({ enum: SubjectEnum })
  subject: SubjectEnum;

  /**
   * Especial permission
   * @example
   * `{"patientId":"${user.sub}"}`
   */
  @Column({ type: 'json', nullable: true })
  conditions: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  constructor(partial: Partial<PermissionEntity>) {
    super();
    Object.assign(this, partial);
  }
}
