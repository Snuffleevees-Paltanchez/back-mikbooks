import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'
import { PermissionsGuard } from './auth/permissions.guard'
import { AuthPermissions } from './auth/auth.permissions'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('API')
  @ApiOperation({ summary: 'Get Hello' })
  @ApiResponse({ status: 200, description: 'Hello World!', type: String })
  getHello(): string {
    return this.appService.getHello()
  }

  /**
   * Only authenticated users can access this route. This does not mean that the user is an admin
   * or has any other role, just that they are authenticated.
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiTags('API')
  @ApiOperation({ summary: 'Get Protected Content' })
  @ApiResponse({ status: 200, description: 'Protected Content', type: String })
  @Get('/protected')
  getProtectedContent(): string {
    return this.appService.getProtectedContent()
  }

  /**
   * Only authenticated users with the read:admin-content permission can access this route.
   */
  @ApiBearerAuth()
  @UseGuards(PermissionsGuard([AuthPermissions.READ_ADMIN]))
  @UseGuards(AuthGuard)
  @ApiTags('API')
  @ApiOperation({ summary: 'Get Admin Content' })
  @ApiResponse({ status: 200, description: 'Admin Content', type: String })
  @Get('/admin')
  getAdmin(): string {
    return this.appService.getAdminMessage()
  }
}
