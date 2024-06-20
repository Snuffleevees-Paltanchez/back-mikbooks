import { UseGuards } from '@nestjs/common'
import { Controller, Delete, Param, NotFoundException } from '@nestjs/common'
import { BookService } from './book.service'
import { AuthGuard } from '../auth/auth.guard'
import { PermissionsGuard } from '../auth/permissions.guard'
import { AuthPermissions } from '../auth/auth.permissions'

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

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
