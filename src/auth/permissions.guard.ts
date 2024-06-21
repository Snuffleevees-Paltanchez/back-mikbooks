import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
} from '@nestjs/common'
import { claimCheck, InsufficientScopeError } from 'express-oauth2-jwt-bearer'
import { promisify } from 'util'

function createPermissionsGuard(requiredRoutePermissions: string[]): Type<CanActivate> {
  @Injectable()
  class PermissionsGuardImpl implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest()
      const response = context.switchToHttp().getResponse()

      const permissionCheck = promisify(
        claimCheck((payload) => {
          const permissionsJwtClaim = (payload.permissions as string[]) || []

          const hasRequiredRoutePermissions = requiredRoutePermissions.every(
            (requiredRoutePermission) =>
              permissionsJwtClaim.includes(requiredRoutePermission),
          )

          if (!hasRequiredRoutePermissions) {
            throw new InsufficientScopeError()
          }

          return hasRequiredRoutePermissions
        }),
      )

      try {
        await permissionCheck(request, response)

        return true
      } catch (error) {
        throw new ForbiddenException('Permission denied')
      }
    }
  }

  return PermissionsGuardImpl
}

export const PermissionsGuard = (routePermissions: string[]): Type<CanActivate> =>
  createPermissionsGuard(routePermissions)
