import { Controller, Get } from '@nestjs/common'
import { DbService } from './db.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('db')
export class DbController {
  constructor(private dbService: DbService) {}

  @Get('populate')
  @ApiTags('DB')
  @ApiOperation({ summary: 'Populate the database with sample data' })
  @ApiResponse({ status: 200, description: 'Database populated', type: Promise<void> })
  populate() {
    console.log('DbController.populate')
    return this.dbService.populate()
  }
}
