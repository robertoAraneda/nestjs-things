import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { User } from '../users/entities/user.entity';
import { UpdatePermissionDto } from './dto/update-permission.dto';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  const mockPermissionsService = () => ({
    create: jest.fn().mockResolvedValue({}),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        { provide: PermissionsService, useFactory: mockPermissionsService },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create an permission', async () => {
      const createDto: CreatePermissionDto = {
        name: 'name',
        identifierValue: 'identifierValue',
        user: {} as User,
      };

      //gatilla test
      const response = await controller.create(createDto);

      expect(response).toEqual({});
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll()', () => {
    it('should find all permissions', async () => {
      const response = await controller.findAll();

      expect(response).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should find one an permission', () => {
      expect(controller.findOne('1')).resolves.toEqual({});
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update()', () => {
    it('should update an permission', function () {
      const updateDto: UpdatePermissionDto = {
        name: 'name edited',
      };

      expect(controller.update('1', updateDto)).resolves.toEqual({});
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('delete()', () => {
    it('should delete an permission', () => {
      controller.remove('1');
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
