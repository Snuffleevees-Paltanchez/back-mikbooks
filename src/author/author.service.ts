import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { authorDto } from './dto'

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(authorData: authorDto) {
    return this.prisma.author.upsert({
      where: { name: authorData.name },
      update: {},
      create: { name: authorData.name },
    })
  }
}
