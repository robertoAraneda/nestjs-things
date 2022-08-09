import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly _permissionsRepository: Repository<PermissionEntity>,
  ) {}
  create(createPermissionDto: CreatePermissionDto): Promise<PermissionEntity> {
    const permission = new PermissionEntity(createPermissionDto);

    return this._permissionsRepository.save(permission);
  }

  findAll(): Promise<PermissionEntity[]> {
    return this._permissionsRepository.find({
      withDeleted: true,
    });
  }

  async findOne(id: number) {
    const permission = await this._permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) throw new NotFoundException('Permission not found');
    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this._permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) throw new NotFoundException('Permission not found');

    this._permissionsRepository.merge(permission, updatePermissionDto);

    return this._permissionsRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this._permissionsRepository.findOne({
      where: { id },
    });

    if (!permission) throw new NotFoundException('Permission not found');

    this._permissionsRepository.softRemove(permission);
  }
}
