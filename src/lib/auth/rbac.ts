import { jwtDecode } from 'jwt-decode'

export type AppRole = 'user' | 'admin' | 'super_admin'

interface DecodedJWT {
  user_role?: AppRole
  [key: string]: any
}

/**
 * Get the user's role from their JWT access token
 * Works in both browser and server contexts
 */
export function getUserRole(accessToken: string): AppRole {
  try {
    const decoded = jwtDecode<DecodedJWT>(accessToken)
    return decoded.user_role || 'user'
  } catch {
    return 'user'
  }
}

/**
 * Check if user has required role or higher
 * Hierarchy: super_admin > admin > user
 */
export function hasRole(accessToken: string, requiredRole: AppRole): boolean {
  const userRole = getUserRole(accessToken)
  
  const roleHierarchy: Record<AppRole, number> = {
    'user': 1,
    'admin': 2,
    'super_admin': 3,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

/**
 * Check if user has exact role (not hierarchical)
 */
export function hasExactRole(accessToken: string, role: AppRole): boolean {
  return getUserRole(accessToken) === role
}
