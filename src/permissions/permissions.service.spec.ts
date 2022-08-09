import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entities/permission.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdatePermissionDto } from './dto/update-permission.dto';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let repository: Repository<PermissionEntity>;

  const tokenRepo = getRepositoryToken(PermissionEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
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

    service = module.get<PermissionsService>(PermissionsService);
    repository = module.get<Repository<PermissionEntity>>(tokenRepo);
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository to be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should save an permission', async () => {
      const createDto: CreatePermissionDto = {
        name: 'name',
        identifierValue: 'identifierValue',
        user: {} as User,
      };

      const response = await service.create(createDto);
      expect(response).toEqual({});
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll()', () => {
    it('should get all permissions', async () => {
      const response = await service.findAll();

      expect(response).toEqual([]);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        withDeleted: true,
      });
    });
  });

  describe('findOne()', () => {
    it('should find one permission', async () => {
      const id = 1;
      const response = await service.findOne(id);

      expect(response).toEqual({});
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if permission not exist', async () => {
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
        expect(e.response.message).toEqual('Permission not found');
      }
    });
  });

  describe('update()', () => {
    it('should update an permission', async () => {
      const updateDto: UpdatePermissionDto = {
        name: 'name edited',
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

    it('should throw NotFoundException if permission not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = 1;
      const updateDto: UpdatePermissionDto = {
        name: 'name edited',
      };
      try {
        await service.update(id, updateDto);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id },
        });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('Permission not found');

        expect(repository.merge).not.toHaveBeenCalled();
        expect(repository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('remove()', () => {
    it('should remove an permission', async () => {
      const id = 1;
      const response = await service.remove(id);

      expect(response).toBeUndefined();

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(repository.softRemove).toHaveBeenCalledWith({});
    });

    it('should throw NotFoundException if permission not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = 1;
      try {
        await service.remove(id);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('Permission not found');
      }
    });
  });
});
