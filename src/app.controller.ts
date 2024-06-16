import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'
import { PermissionsGuard } from './auth/permissions.guard'
import { AuthPermissions } from './auth/auth.permissions'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  /**
   * Only authenticated users can access this route. This does not mean that the user is an admin
   * or has any other role, just that they are authenticated.
   */
  @UseGuards(AuthGuard)
  @Get('/protected')
  getProtectedContent(): string {
    return this.appService.getProtectedContent()
  }

  /**
   * Only authenticated users with the read:admin-content permission can access this route.
   */
  @UseGuards(PermissionsGuard([AuthPermissions.READ_ADMIN]))
  @UseGuards(AuthGuard)
  @Get('/admin')
  getAdmin(): string {
    return this.appService.getAdminMessage()
  }
}
