import {
  Controller,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common'
import { BookService } from './book.service'
import { BookDto } from './dto'

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

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
