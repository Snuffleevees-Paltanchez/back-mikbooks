import { Controller, Get, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoriesResponse, GetCategoriesDto } from './dto'
import { ApiTags } from '@nestjs/swagger'
import { ApiEndpoint } from 'src/common/decorators/common.docs.decorators'

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiEndpoint({ summary: 'Get all categories', type: CategoriesResponse })
  async getAllCategories(@Query() query: GetCategoriesDto) {
    const { page, limit, ...filters } = query
    const books = await this.categoryService.getAllCategories(page, limit, filters)
    return books
  }
}
