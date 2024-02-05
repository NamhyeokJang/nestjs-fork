export enum USER_ROLE {
  ANONYMOUS = 'ANONYMOUS',
  GUEST = 'GUEST',
  USER = 'USER',
  ADMIN = 'ADMIN',
  MASTER = 'MASTER',
}

export const USER_ROLE_LV = {
  [USER_ROLE.ANONYMOUS]: 3,
  [USER_ROLE.GUEST]: 5,
  [USER_ROLE.USER]: 7,
  [USER_ROLE.ADMIN]: 10,
  [USER_ROLE.MASTER]: 15,
}