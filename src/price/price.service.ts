import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { priceDto } from './dto'

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}
  async findOrCreate(data: priceDto) {
    return this.prisma.price.upsert({
      where: {
        bookId_platformId: {
          bookId: data.bookId,
          platformId: data.platformId,
        },
      },
      update: {
        price: data.price,
        date: data.date,
      },
      create: {
        bookId: data.bookId,
        platformId: data.platformId,
        price: data.price,
        date: data.date,
        productUrl: data.productUrl,
      },
    })
  }
}
