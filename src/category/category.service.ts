import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { categoriesDto, categoryDto } from './dto'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(categoryData: categoriesDto): Promise<categoryDto[]> {
    const categoriesArray = this.parseCategories(categoryData.categories)
    if (!categoriesArray) {
      return []
    }

    const categoryPromises = categoriesArray.map(async (category) => {
      return await this.prisma.category.upsert({
        where: { name: category },
        update: {},
        create: { name: category },
      })
    })

    const resolvedCategories = await Promise.all(categoryPromises)
    return resolvedCategories
  }

  parseCategories(categoryArray: string | null): string[] {
    if (!categoryArray) {
      return []
    }

    let services = categoryArray.replace(/'/g, '"')
    services = JSON.parse(services)

    const allCategories = services[0].split(',').map((category) => {
      return category.trim()
    })
    return allCategories
  }
}
