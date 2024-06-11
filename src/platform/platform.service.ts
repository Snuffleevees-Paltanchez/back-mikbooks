import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { platformDto } from './dto'

@Injectable()
export class PlatformService {
  constructor(private prisma: PrismaService) {}
  async findOrCreate(platformData: platformDto) {
    return this.prisma.platform.upsert({
      where: { name: platformData.name },
      update: {},
      create: { name: platformData.name, url: platformData.url },
    })
  }
}
