import { SetMetadata } from '@nestjs/common';

// export type RolesDecoratorParams<T extends string = string> = Parameters<
//   (roles: T[], attributes?: Partial<Record<T, string>>) => void
// >;

// export const Roles_e = <T extends string = string>(
//   roles: RolesDecoratorParams<T>[0],
//   attributes?: RolesDecoratorParams<T>[1],
// ) => SetMetadata('roles', [roles, attributes]);


export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
