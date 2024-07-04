import { Controller, Get, Query } from '@nestjs/common'
import { AuthorsResponse, GetAuthorsDto, AuthorWithBooksCountDto } from './dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthorService } from './author.service'
import { ApiEndpoint } from 'src/common/decorators/common.docs.decorators'

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @ApiEndpoint({ summary: 'Get all authors', type: AuthorsResponse })
  async getAllCategories(@Query() query: GetAuthorsDto) {
    const { page, limit, ...filters } = query
    const books = await this.authorService.getAllAuthors(page, limit, filters)
    return books
  }

  @Get('most-books')
  @ApiEndpoint({
    summary: 'Get authors with most books',
    type: [AuthorWithBooksCountDto],
  })
  async getAuthorsWithMostBooks() {
    const authors = await this.authorService.getAuthorsWithMostBooks()
    return authors
  }
}
