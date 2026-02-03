import useAuth from './useAuth';

const useRole = () => {
  const { user } = useAuth();

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isSuperAdmin = () => {
    return user?.role === 'SUPER_ADMIN';
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const canAccess = (requiredRoles = []) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.[permission] === true;
  };

  return {
    hasRole,
    isSuperAdmin,
    isAdmin,
    canAccess,
    hasPermission,
    currentRole: user?.role,
    permissions: user?.permissions
  };
};

export default useRole;