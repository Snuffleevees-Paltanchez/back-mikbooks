import { Controller, Get, UseGuards } from '@nestjs/common'
import { DbService } from './db.service'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'

@ApiBearerAuth()
@Controller('db')
export class DbController {
  constructor(private dbService: DbService) {}

  @Get('populate')
  @ApiTags('DB')
  @ApiOperation({ summary: 'Populate the database with sample data' })
  @ApiResponse({ status: 200, description: 'Database populated', type: Promise<void> })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  populate() {
    console.log('DbController.populate')
    return this.dbService.populate()
  }
}
