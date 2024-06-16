import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthGuard } from './auth/auth.guard'

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
}
