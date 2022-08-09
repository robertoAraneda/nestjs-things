import { Ability, ForcedSubject } from '@casl/ability';

export const actions = [
  'manage',
  'create',
  'read',
  'update',
  'delete',
] as const;

export const subjects = [
  'Role',
  'User',
  'Permission',
  'Article',
  'all',
] as const;

export type Actions = typeof actions[number];
export type Subjects =
  | typeof subjects[number]
  | ForcedSubject<Exclude<typeof subjects[number], 'all'>>;

export type AppAbilities = [Actions, Subjects];

export type AppAbility = Ability<AppAbilities>;

export enum ActionEnum {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum SubjectEnum {
  ROLE = 'Role',
  USER = 'User',
  PERMISSION = 'Permission',
  ARTICLE = 'Article',
  ALL = 'all',
}
