import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'
import { PermissionsGuard } from './auth/permissions.guard'
import { AuthPermissions } from './auth/auth.permissions'
import { ApiTags } from '@nestjs/swagger'
import { ApiEndpoint } from './common/decorators/common.docs.decorators'

class Message {
  message: string
}

@ApiTags('API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiEndpoint({ summary: 'Get Hello', type: Message })
  getHello(): string {
    return this.appService.getHello()
  }

  /**
   * Only authenticated users can access this route. This does not mean that the user is an admin
   * or has any other role, just that they are authenticated.
   */
  @Get('/protected')
  @ApiEndpoint({ summary: 'Get Protected Content', auth: true, type: Message })
  @UseGuards(AuthGuard)
  getProtectedContent(): { message: string } {
    return this.appService.getProtectedContent()
  }

  /**
   * Only authenticated users with the read:admin-content permission can access this route.
   */
  @Get('/admin')
  @ApiEndpoint({ summary: 'Get Admin Content', auth: true, type: Message })
  @UseGuards(AuthGuard)
  @UseGuards(PermissionsGuard([AuthPermissions.READ_ADMIN]))
  getAdminContent(): { message: string } {
    return this.appService.getAdminContent()
  }
}
