import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = () => ({
    create: jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useFactory: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create an user', async () => {
      const createDto: CreateUserDto = {
        given: 'given',
        family: 'family',
        password: 'password',
      };

      //gatilla test
      const response = await controller.create(createDto);

      expect(response).toEqual({});
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll()', () => {
    it('should find all users', async () => {
      const response = await controller.findAll();

      expect(response).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should find one an user', () => {
      expect(controller.findOne('1')).resolves.toEqual({});
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update()', () => {
    it('should update an user', function () {
      const updateDto: UpdateUserDto = {
        given: 'given edited',
      };

      expect(controller.update('1', updateDto)).resolves.toEqual({});
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('delete()', () => {
    it('should delete an user', () => {
      controller.remove('1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
