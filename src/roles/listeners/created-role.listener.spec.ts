import { RolesService } from '../roles.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatedRoleListener } from './created-role.listener';
import { CreatedRoleEvent } from '../events/created-role.event';

describe('RolesService', () => {
  let listener: CreatedRoleListener;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatedRoleListener],
    }).compile();

    listener = module.get<CreatedRoleListener>(CreatedRoleListener);
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('onCreatedRole()', () => {
    it('should call logger.log()', () => {
      const loggerSpy = jest.spyOn(listener.logger, 'log');
      const payload = {
        role: {
          display: 'display',
        },
      } as CreatedRoleEvent;

      listener.handleRoleCreatedEvent(payload);

      expect(loggerSpy).toHaveBeenCalledTimes(1);
      expect(loggerSpy).toHaveBeenCalledWith(
        `Created role: ${payload.role.display}`,
      );
    });
  });
});
