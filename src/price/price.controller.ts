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
import { ApiTags } from '@nestjs/swagger'
import { ApiEndpoint } from 'src/common/decorators/common.docs.decorators'

@ApiTags('Prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':id')
  @ApiEndpoint({
    info: { summary: 'Get price by id', notFound: 'Price' },
    type: PriceDtoResponse,
  })
  async getPrice(@Param('id') id: string) {
    const price = await this.priceService.getPrice(id)
    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`)
    }
    return price
  }

  @Put(':id')
  @ApiEndpoint({ info: { summary: 'Update price' }, auth: true, type: PriceDtoResponse })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updatePrice(@Param('id') id: string, @Body() priceData: EditPriceDto) {
    return this.priceService.updatePrice(id, priceData)
  }

  @Delete(':id')
  @ApiEndpoint({
    info: { summary: 'Delete price', notFound: 'Price' },
    auth: true,
    type: PriceDtoResponseChanded,
  })
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
  @ApiEndpoint({
    info: { summary: 'Restore price', notFound: 'Price' },
    auth: true,
    type: PriceDtoResponseChanded,
  })
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
