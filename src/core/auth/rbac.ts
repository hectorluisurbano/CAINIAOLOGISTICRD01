export type Role = 'USER' | 'AGENT' | 'ADMIN';

export const ROLES: Record<Role, Role> = {
  USER: 'USER',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN',
};

/**
 * Define las jerarquías de roles y permisos.
 * Un AGENT puede hacer lo que un USER puede hacer.
 * Un ADMIN puede hacer lo que un AGENT y un USER pueden hacer.
 */
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  USER: ['USER'],
  AGENT: ['USER', 'AGENT'],
  ADMIN: ['USER', 'AGENT', 'ADMIN'],
};

/**
 * Verifica si un rol de usuario tiene el nivel de acceso requerido.
 * @param userRole El rol actual del usuario.
 * @param requiredRole El rol mínimo requerido para la acción.
 * @returns boolean
 */
export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const permissions = ROLE_HIERARCHY[userRole] || [];
  return permissions.includes(requiredRole);
}

/**
 * Lanza un error si el usuario no tiene los permisos necesarios.
 */
export function validateRole(userRole: Role, requiredRole: Role): void {
  if (!hasPermission(userRole, requiredRole)) {
    throw new Error(`Acceso denegado: se requiere rol ${requiredRole}`);
  }
}
