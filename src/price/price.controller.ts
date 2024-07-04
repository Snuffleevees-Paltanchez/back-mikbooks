import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Delete,
} from '@nestjs/common'
import { PriceService } from './price.service'
import { EditPriceDto, PriceDtoResponse, PriceDtoResponseChanded } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('Prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':id')
  async getPrice(@Param('id') id: string) {
    const price = await this.priceService.getPrice(id)
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`)
    }
    return price
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update price' })
  @ApiResponse({
    status: 200,
    description: 'Price updated successfully',
    type: PriceDtoResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updatePrice(@Param('id') id: string, @Body() priceData: EditPriceDto) {
    return this.priceService.updatePrice(id, priceData)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mark price as deleted' })
  @ApiResponse({
    status: 200,
    description: 'Price marked as deleted successfully',
    type: PriceDtoResponseChanded,
  })
  @ApiResponse({ status: 404, description: 'Price not found' })
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

  @Put('restore/:id')
  @ApiOperation({ summary: 'Restore price' })
  @ApiResponse({
    status: 200,
    description: 'Price restored successfully',
    type: PriceDtoResponseChanded,
  })
  @ApiResponse({ status: 404, description: 'Price not found' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async restorePrice(@Param('id') id: number) {
    const price = await this.priceService.restorePrice(id)
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`)
    }
    return {
      message: 'Price restored successfully',
      data: price,
    }
  }
}
