import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _rolesRepository: Repository<RoleEntity>,
    private readonly _eventEmitter: EventEmitter2,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = new RoleEntity(createRoleDto);

    const createdRole = await this._rolesRepository.save(role);

    this._eventEmitter.emit('role.created', { role: createdRole });

    return createdRole;
  }

  findAll(): Promise<RoleEntity[]> {
    return this._rolesRepository.find({
      withDeleted: true,
    });
  }

  async findOne(id: number) {
    const role = await this._rolesRepository.findOne({
      where: { id },
      relations: {
        permissions: true,
      },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const role = await this._rolesRepository.findOne({
      where: { id },
    });

    if (!role) throw new NotFoundException('Role not found');

    this._rolesRepository.merge(role, updateRoleDto);

    return this._rolesRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this._rolesRepository.findOne({
      where: { id },
    });

    if (!role) throw new NotFoundException('Role not found');

    this._rolesRepository.softRemove(role);
  }
}
