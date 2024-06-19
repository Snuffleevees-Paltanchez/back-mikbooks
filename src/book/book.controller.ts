import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common'
import { BookService } from './book.service'
import { BookDto } from './dto'

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(@Query() query: any) {
    const { page, limit, ...filters } = query
    if (page && isNaN(parseInt(page))) {
      throw new NotFoundException('Invalid page number')
    }
    if (limit && isNaN(parseInt(limit))) {
      throw new NotFoundException('Invalid limit')
    }
    const books = await this.bookService.getAllBooks(
      filters,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    )
    if (!books || books.total === 0) {
      throw new NotFoundException('No books found')
    }
    return books
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    if (isNaN(parseInt(id))) {
      throw new NotFoundException('Invalid id')
    }
    const book = await this.bookService.getBookById(parseInt(id))
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body(new ValidationPipe()) bookDto: BookDto,
  ) {
    const updatedBook = await this.bookService.updateBook(parseInt(id, 10), bookDto)
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
