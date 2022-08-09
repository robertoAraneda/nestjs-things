import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly _rolesRepository: Repository<RoleEntity>,
  ) {}
  create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = new RoleEntity(createRoleDto);

    return this._rolesRepository.save(role);
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
