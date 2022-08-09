import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import interpolateHelper from './interpolate.helper';
import { Ability, subject } from '@casl/ability';
import { RolesService } from '../roles/roles.service';
import { AppAbilities } from './casl.type';
import { LoggedUserDto } from '../auth/dtos/logged-user.dto';

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly _rolesService: RolesService) {}

  async createAbility(user: LoggedUserDto) {
    const role = await this._rolesService.findOne(user.role);

    const permissions = role.permissions.map((permission) => {
      const { action, subject, conditions } = permission;

      if (conditions) {
        return { action, subject, conditions };
      }

      return { action, subject };
    });

    console.log(permissions);

    const interpolatePermissions = interpolateHelper(
      JSON.stringify(permissions),
      { user },
    );

    return new Ability<AppAbilities>(interpolatePermissions);
  }
}
