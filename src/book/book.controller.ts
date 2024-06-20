import { UseGuards } from '@nestjs/common'
import { BookService } from './book.service'
import { GetBooksDto, GetBookByISBNDto } from './dto'
import { Controller, Get, Delete, Param, Query, NotFoundException } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(@Query() query: GetBooksDto) {
    const { page, limit, ...filters } = query
    const books = await this.bookService.getAllBooks(page, limit, filters)
    if (!books || books.total === 0) {
      throw new NotFoundException('No books found')
    }
    return books
  }

  @Get(':id')
  async getBookById(@Param('id') id: number) {
    const book = await this.bookService.getBookById(id)
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  @Get('isbn/:isbn')
  async getBookByIsbn(@Param() { isbn }: GetBookByISBNDto) {
    const book = await this.bookService.getBookByISBN(isbn)
    if (!book) {
      throw new NotFoundException(`Book with isbn ${isbn} not found`)
    }
    return book
  }

  @Delete(':id')
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
}
