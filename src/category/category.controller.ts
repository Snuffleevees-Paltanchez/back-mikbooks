import { Controller, Get, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoriesResponse, GetCategoriesDto } from './dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiTags('Categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'List of Categories',
    type: CategoriesResponse,
  })
  async getAllCategories(@Query() query: GetCategoriesDto) {
    const { page, limit, ...filters } = query
    const books = await this.categoryService.getAllCategories(page, limit, filters)
    return books
  }
}
