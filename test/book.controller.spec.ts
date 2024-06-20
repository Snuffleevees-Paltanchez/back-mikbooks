import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from '../src/book/book.controller';
import { BookService } from '../src/book/book.service';
import { NotFoundException } from '@nestjs/common';

class MockBookService {
  async deleteBook(id: number) {
    if (id === 1) {
      return { id: 1, title: 'Mock Book', isDeleted: true };
    } else {
      return null;
    }
  }
}

describe('BookController', () => {
  let controller: BookController;
  //let bookService: MockBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useClass: MockBookService, 
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    //bookService = module.get<BookService, MockBookService>(BookService); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteBook', () => {
    it('should mark a book as deleted', async () => {
      const bookId = 1;
      const result = await controller.deleteBook(bookId);
      expect(result).toEqual({
        message: 'Book marked as deleted successfully',
        data: { id: 1, title: 'Mock Book', isDeleted: true },
      });
    });

    it('should throw NotFoundException if book does not exist', async () => {
      const invalidBookId = 999;
      await expect(controller.deleteBook(invalidBookId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
