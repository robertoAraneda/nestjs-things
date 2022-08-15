import { OnEvent } from '@nestjs/event-emitter';
import { CreatedRoleEvent } from '../events/created-role.event';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CreatedRoleListener {
  logger: Logger;

  constructor() {
    this.logger = new Logger(CreatedRoleListener.name);
  }

  @OnEvent('role.created')
  handleRoleCreatedEvent(payload: CreatedRoleEvent) {
    this.logger.log(`Created role: ${payload.role.display}`);
  }
}
