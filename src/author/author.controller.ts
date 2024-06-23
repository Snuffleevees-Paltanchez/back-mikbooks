import { Controller, Get, Query } from '@nestjs/common'
import { AuthorsResponse, GetAuthorsDto } from './dto'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthorService } from './author.service'

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @ApiTags('Authors')
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({
    status: 200,
    description: 'List of authors',
    type: AuthorsResponse,
  })
  async getAllCategories(@Query() query: GetAuthorsDto) {
    const { page, limit, ...filters } = query
    const books = await this.authorService.getAllAuthors(page, limit, filters)
    return books
  }

  @Get('most-books')
  async getAuthorsWithMostBooks() {
    const authors = await this.authorService.getAuthorsWithMostBooks()
    return authors
  }
}
