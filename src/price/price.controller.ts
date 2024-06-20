import { Controller, Put, Body, Param, UseGuards } from '@nestjs/common'
import { PriceService } from './price.service'
import { priceDto } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Put(':id/price')
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updatePrice(@Param('id') id: string, @Body() priceData: priceDto) {
    return this.priceService.updatePrice(id, priceData)
  }
}
