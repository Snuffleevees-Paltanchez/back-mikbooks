import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CategoriesDto, CategoryDto, CategoryFilterDto } from './dto'

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(categoryData: CategoriesDto): Promise<CategoryDto[]> {
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

  async getAllCategories(
    page: number = 1,
    limit: number = 50,
    filter: CategoryFilterDto = {},
  ) {
    const { name } = filter

    const filterConditions: any = {}

    if (name) {
      filterConditions.name = { contains: name, mode: 'insensitive' }
    }

    const offset = (page - 1) * limit

    const categories = await this.prisma.category.findMany({
      where: filterConditions,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        isDeleted: true,
      },
    })
    const total = await this.prisma.category.count({
      where: filterConditions,
    })
    return {
      total: total,
      page: page,
      limit: limit,
      data: categories,
    }
  }
}
