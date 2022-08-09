import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Repository<RoleEntity>;

  const tokenRepo = getRepositoryToken(RoleEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: tokenRepo,
          useValue: {
            save: jest.fn().mockResolvedValue({}),
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            merge: jest.fn(),
            softRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get<Repository<RoleEntity>>(tokenRepo);
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository to be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should save an role', async () => {
      const createDto: CreateRoleDto = {
        code: 'code',
        display: 'display',
      };

      const response = await service.create(createDto);
      expect(response).toEqual({});
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll()', () => {
    it('should get all roles', async () => {
      const response = await service.findAll();

      expect(response).toEqual([]);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        withDeleted: true,
      });
    });
  });

  describe('findOne()', () => {
    it('should find one role', async () => {
      const id = 1;
      const response = await service.findOne(id);

      expect(response).toEqual({});
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if role not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = 1;
      try {
        await service.findOne(id);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id },
        });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('Role not found');
      }
    });
  });

  describe('update()', () => {
    it('should update an role', async () => {
      const updateDto: UpdateRoleDto = {
        display: 'display edited',
      };

      const id = 1;
      const response = await service.update(id, updateDto);

      expect(response).toEqual({});
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledWith({}, updateDto);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({});
    });

    it('should throw NotFoundException if role not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = 1;
      const updateDto: UpdateRoleDto = {
        display: 'display edited',
      };
      try {
        await service.update(id, updateDto);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id },
        });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('Role not found');

        expect(repository.merge).not.toHaveBeenCalled();
        expect(repository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('remove()', () => {
    it('should remove an role', async () => {
      const id = 1;
      const response = await service.remove(id);

      expect(response).toBeUndefined();

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(repository.softRemove).toHaveBeenCalledWith({});
    });

    it('should throw NotFoundException if role not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = 1;
      try {
        await service.remove(id);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('Role not found');
      }
    });
  });
});
