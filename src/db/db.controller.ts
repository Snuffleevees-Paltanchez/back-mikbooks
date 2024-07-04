import { Controller, Get, UseGuards } from '@nestjs/common'
import { DbService } from './db.service'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'
import { ApiEndpoint } from 'src/common/decorators/common.docs.decorators'

@ApiBearerAuth()
@ApiTags('DB')
@Controller('db')
export class DbController {
  constructor(private dbService: DbService) {}

  @Get('populate')
  @ApiEndpoint({ info: { summary: 'Populate db with sample data' }, type: Promise<void> })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  populate() {
    return this.dbService.populate()
  }
}
