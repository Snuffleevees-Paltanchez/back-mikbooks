import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { priceDto } from './dto'

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(priceData: priceDto) {
    const { bookId, platformId, date, productUrl } = priceData

    let price = await this.prisma.price.findFirst({
      where: {
        bookId,
        platformId,
        date,
        productUrl,
      },
    })

    if (!price) {
      price = await this.prisma.price.create({
        data: {
          bookId,
          platformId,
          price: priceData.price,
          date,
          productUrl,
        },
      })
    }
    return price
  }

  async updatePrice(id: string, priceData: priceDto) {
    const existingPrice = await this.prisma.price.findUnique({
      where: {
        id: parseInt(id),
      },
    })
    if (!existingPrice) {
      throw new NotFoundException(`Price with ID ${id} not found`)
    }
    return this.prisma.price.update({
      where: {
        id: existingPrice.id,
      },
      data: {
        price: priceData.price,
      },
    })
  }

  async deletePrice(id: number) {
    const deletedPrice = await this.prisma.price.update({
      where: { id },
      data: { isDeleted: true },
    })
    if (!deletedPrice) {
      throw new NotFoundException(`Price with ID ${id} not found`)
    }
    return deletedPrice
  }
}
