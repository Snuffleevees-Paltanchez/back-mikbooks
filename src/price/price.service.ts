import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { priceDto } from './dto'

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}

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
    return deletedPrice
  }
}
