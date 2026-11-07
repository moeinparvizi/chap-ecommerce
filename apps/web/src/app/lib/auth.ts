export function isAdminRole(role: string | undefined): boolean {
  return role === 'admin' || role === 'super_admin';
}
