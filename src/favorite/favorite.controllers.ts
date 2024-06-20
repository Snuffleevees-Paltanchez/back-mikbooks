import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { FavoriteService } from './favorite.service'
import { FavoriteDto } from './dto'

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async createFavorite(@Body() favoriteDto: FavoriteDto) {
    const favorite = await this.favoriteService.createFavorite(favoriteDto)
    return favorite
  }

  @Delete(':id')
  async deleteFavorite(@Param('id') id: number, @Body() favoriteDto: FavoriteDto) {
    const deletedFavorite = await this.favoriteService.deleteFavorite(id, favoriteDto)
    return deletedFavorite
  }

  @Get(':userId/:bookId')
  async isFavorite(@Param('userId') userId: number, @Param('bookId') bookId: number) {
    const favorite = await this.favoriteService.isFavorite(userId, bookId)
    return favorite
  }

  @Get(':userId')
  async getFavorites(@Param('userId') userId: number) {
    const favorites = await this.favoriteService.getFavorites(userId)
    return favorites
  }
}
