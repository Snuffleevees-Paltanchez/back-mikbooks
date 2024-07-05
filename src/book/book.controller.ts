import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common'
import { UseGuards } from '@nestjs/common'
import { BookService } from './book.service'
import { BookDto, GetBooksDto, GetBookByISBNDto, BooksResponse, BooksKpi } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'
import { ApiTags } from '@nestjs/swagger'
import { ApiEndpoint } from 'src/common/decorators/common.docs.decorators'

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiEndpoint({ summary: 'Get all books', type: BooksResponse })
  async getAllBooks(@Query() query: GetBooksDto) {
    const { page, limit, ...filters } = query
    const books = await this.bookService.getAllBooks(page, limit, filters)
    return books
  }

  @Get('kpi')
  @ApiEndpoint({ summary: 'Get books Key Performance Indicators', type: BooksKpi })
  async getBooksKpi() {
    return this.bookService.getBooksKpi()
  }

  @Get('id/:id')
  @ApiEndpoint({ summary: 'Get book by id', notFound: 'Book', type: BookDto })
  async getBookById(@Param('id') id: number) {
    const book = await this.bookService.getBookById(id)
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  @Get('isbn/:isbn')
  @ApiEndpoint({ summary: 'Get book by ISBN', notFound: 'Book', type: BookDto })
  async getBookByISBN(@Param() { isbn }: GetBookByISBNDto) {
    const book = await this.bookService.getBookByISBN(isbn)
    if (!book) {
      throw new NotFoundException(`Book with isbn ${isbn} not found`)
    }
    return book
  }

  @Get('recommendations/:isbn')
  @ApiEndpoint({
    summary: 'Get book recommendations by ISBN',
    notFound: 'Book',
    type: [BookDto],
  })
  async getBookRecommendationsByISBN(@Param() { isbn }: GetBookByISBNDto) {
    const recommendations = await this.bookService.getBookRecommendationsByISBN(isbn)
    return recommendations
  }

  @Post()
  @ApiEndpoint({ summary: 'Create a new book', type: BookDto, auth: true })
  async createBook(@Body() bookDto: BookDto) {
    return this.bookService.createBook(bookDto)
  }

  @Put(':id')
  @ApiEndpoint({ summary: 'Update book', notFound: 'book', type: BookDto, auth: true })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updateBook(@Param('id') id: number, @Body() bookDto: BookDto) {
    const updatedBook = await this.bookService.updateBook(id, bookDto)
    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return updatedBook
  }

  @Delete(':id')
  @ApiEndpoint({ summary: 'Delete book', notFound: 'Book', type: BookDto, auth: true })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async deleteBook(@Param('id') id: number) {
    const deletedBook = await this.bookService.deleteBook(id)
    if (!deletedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return {
      message: 'Book marked as deleted successfully',
      data: deletedBook,
    }
  }

  @Put('restore/:id')
  @ApiEndpoint({ summary: 'Restore book', notFound: 'Book', type: BookDto, auth: true })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async restoreBook(@Param('id') id: number) {
    const book = await this.bookService.restoreBook(id)
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return {
      message: 'Book restored successfully',
      data: book,
    }
  }
}
