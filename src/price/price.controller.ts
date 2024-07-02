import {
  Controller,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Delete,
} from '@nestjs/common'
import { PriceService } from './price.service'
import { priceDto } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Put(':id/price')
  @ApiTags('Prices')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updatePrice(@Param('id') id: string, @Body() priceData: priceDto) {
    return this.priceService.updatePrice(id, priceData)
  }

  @Delete(':id')
  @ApiTags('Prices')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async deletePrice(@Param('id') id: number) {
    const deletedPrice = await this.priceService.deletePrice(id)
    if (!deletedPrice) {
      throw new NotFoundException(`Price with id ${id} not found`)
    }
    return {
      message: 'Price marked as deleted successfully',
      data: deletedPrice,
    }
  }
}
