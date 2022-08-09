import { SetMetadata } from '@nestjs/common';
import { Actions, AppAbility, Subjects } from './casl.type';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export interface CheckAbility {
  action: Actions;
  subject: Subjects;
}

export const CHECK_POLICIES_KEY = 'check_policy';
export const CHECK_ABILITY = 'check_ability';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);

export const CheckPolicies_ = (ability: CheckAbility) =>
  SetMetadata(CHECK_ABILITY, ability);
