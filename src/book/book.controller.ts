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
import { BookDto, GetBooksDto, GetBookByISBNDto, BooksResponse } from './dto'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({
    status: 200,
    description: 'List of books',
    type: BooksResponse,
  })
  async getAllBooks(@Query() query: GetBooksDto) {
    const { page, limit, ...filters } = query
    const books = await this.bookService.getAllBooks(page, limit, filters)
    return books
  }

  @Get('kpi')
  @ApiOperation({ summary: 'Get books KPI (Key Performance Indicators)' })
  @ApiResponse({ status: 200, description: 'Books KPI', type: Object })
  async getBooksKpi() {
    return this.bookService.getBooksKpi()
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get book by id' })
  @ApiResponse({ status: 200, description: 'Book found', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookById(@Param('id') id: number) {
    const book = await this.bookService.getBookById(id)
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  @Get('isbn/:isbn')
  @ApiOperation({ summary: 'Get book by ISBN' })
  @ApiResponse({ status: 200, description: 'Book found', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookByISBN(@Param() { isbn }: GetBookByISBNDto) {
    const book = await this.bookService.getBookByISBN(isbn)
    if (!book) {
      throw new NotFoundException(`Book with isbn ${isbn} not found`)
    }
    return book
  }

  @Get('recommendations/:isbn')
  @ApiOperation({ summary: 'Get book recommendations by ISBN' })
  @ApiResponse({ status: 200, description: 'List of recommended books', type: [BookDto] })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async getBookRecommendationsByISBN(@Param() { isbn }: GetBookByISBNDto) {
    const recommendations = await this.bookService.getBookRecommendationsByISBN(isbn)
    return recommendations
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created', type: BookDto })
  async createBook(@Body() bookDto: BookDto) {
    return this.bookService.createBook(bookDto)
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update book by id' })
  @ApiResponse({ status: 200, description: 'Book updated', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @UseGuards(AuthGuard, PermissionsGuard([AuthPermissions.UPDATE_ADMIN]))
  async updateBook(@Param('id') id: number, @Body() bookDto: BookDto) {
    const updatedBook = await this.bookService.updateBook(id, bookDto)
    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return updatedBook
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete book by id' })
  @ApiResponse({ status: 200, description: 'Book deleted', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore book by id' })
  @ApiResponse({ status: 200, description: 'Book restored', type: BookDto })
  @ApiResponse({ status: 404, description: 'Book not found' })
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
