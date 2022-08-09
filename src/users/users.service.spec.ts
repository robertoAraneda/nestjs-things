import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const tokenRepo = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(tokenRepo);
  });

  it('should service to be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository to be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should save an user', async () => {
      const createDto: CreateUserDto = {
        given: 'given',
        family: 'family',
        password: 'password',
      };

      const response = await service.create(createDto);
      expect(response).toEqual({});
      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll()', () => {
    it('should get all users', async () => {
      const response = await service.findAll();

      expect(response).toEqual([]);

      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(repository.find).toHaveBeenCalledWith({
        withDeleted: true,
      });
    });
  });

  describe('findOne()', () => {
    it('should find one user', async () => {
      const id = '1';
      const response = await service.findOne(id);

      expect(response).toEqual({});
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if user not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = '1';
      try {
        await service.findOne(id);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id },
        });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('User not found');
      }
    });
  });

  describe('update()', () => {
    it('should update an user', async () => {
      const updateDto: UpdateUserDto = {
        given: 'gsiven edited',
      };

      const id = '1';
      const response = await service.update(id, updateDto);

      expect(response).toEqual({});
      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(repository.merge).toHaveBeenCalledTimes(1);
      expect(repository.merge).toHaveBeenCalledWith({}, updateDto);

      expect(repository.save).toHaveBeenCalledTimes(1);
      expect(repository.save).toHaveBeenCalledWith({});
    });

    it('should throw NotFoundException if user not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = '1';
      try {
        await service.findOne(id);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id },
        });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('User not found');

        expect(repository.merge).not.toHaveBeenCalled();
        expect(repository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('remove()', () => {
    it('should remove an user', async () => {
      const id = '1';
      const response = await service.remove(id);

      expect(response).toBeUndefined();

      expect(repository.findOne).toHaveBeenCalledTimes(1);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(repository.softRemove).toHaveBeenCalledWith({});
    });

    it('should throw NotFoundException if user not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const id = '1';
      try {
        await service.remove(id);
      } catch (e) {
        expect(repository.findOne).toHaveBeenCalledTimes(1);
        expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });

        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toEqual('User not found');
      }
    });
  });
});
