import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common'
import { BookService } from './book.service'
import { BookDto, GetBooksDto, GetBookByISBNDto } from './dto'

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

  @Put(':id')
  async updateBook(@Param('id') id: number, @Body() bookDto: BookDto) {
    const updatedBook = await this.bookService.updateBook(id, bookDto)
    if (!updatedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return updatedBook
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: number) {
    const deletedBook = await this.bookService.deleteBook(id)
    if (!deletedBook) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return {
      message: 'Book deleted successfully',
      data: deletedBook,
    }
  }
}
