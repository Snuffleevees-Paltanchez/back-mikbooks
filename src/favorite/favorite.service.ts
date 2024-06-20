import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FavoriteDto } from './dto'

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async createFavorite(data: FavoriteDto) {
    const favorite = await this.prisma.favorite.create({
      data: {
        userId: data.userId,
        bookId: data.bookId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    })
    return favorite
  }

  async deleteFavorite(id: number, data: FavoriteDto) {
    const { userId, bookId } = data

    try {
      const updatedFavorite = await this.prisma.favorite.update({
        where: { id },
        data: {
          userId,
          bookId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: true,
        },
      })
      return updatedFavorite
    } catch (error) {
      throw new NotFoundException(`Favorite with id ${id} not found`)
    }
  }

  async isFavorite(userId: number, bookId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        bookId,
        isDeleted: false,
      },
    })
    return favorite ? true : false
  }

  async getFavorites(userId: number) {
    const favorites = await this.prisma.favorite.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    })
    return favorites
  }
}
