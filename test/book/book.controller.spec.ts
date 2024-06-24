import { Test, TestingModule } from '@nestjs/testing'
import { BookController } from '../../src/book/book.controller'
import { BookService } from '../../src/book/book.service'
import { BookDto } from '../../src/book/dto/book.dto'
import { PrismaService } from '../../src/prisma/prisma.service'

describe('BookController', () => {
  let controller: BookController
  let service: BookService
  let prisma = {
    book: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      delete: jest.fn(),
    },
  }

  const expectedBook = {
    id: 1,
    title: 'Test Book',
    author: {
      id: 1,
      name: 'Author Name',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    },
    isbn: '123-456-789',
    authorId: 1,
    publicationDate: new Date(),
    description: 'A test book',
    imgUrl: 'http://example.com/img.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    categories: [],
    prices: [],
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService, { provide: PrismaService, useValue: prisma }],
    }).compile()

    controller = module.get<BookController>(BookController)
    service = module.get<BookService>(BookService)
    prisma = module.get<typeof prisma>(PrismaService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a book', async () => {
    const testBook: BookDto = {
      title: 'Test Book',
      authorId: 1,
      isbn: '123-456-789',
      description: 'Test Description',
      imgUrl: 'http://example.com/img.jpg',
      categories: ['Test Category'],
      publishedDate: new Date(),
    }

    const expectedResult = {
      id: 1,
      title: 'Test Book',
      isbn: '123-456-789',
      authorId: 1,
      publicationDate: new Date(),
      description: 'Test Description',
      imgUrl: 'http://example.com/img.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    }

    jest.spyOn(service, 'createBook').mockImplementation(async () => expectedResult)
    expect(await controller.createBook(testBook)).toEqual(expectedResult)
  })

  it('should return all books', async () => {
    const expectedResult = {
      data: [expectedBook],
      total: 1,
      page: 1,
      hasNextPage: false,
      limit: 20,
    }
    const query = {}
    jest.spyOn(service, 'getAllBooks').mockImplementation(async () => expectedResult)
    expect(await controller.getAllBooks(query)).toEqual(expectedResult)
  })

  it('should return a book by ID', async () => {
    jest.spyOn(service, 'getBookById').mockImplementation(async () => expectedBook)
    expect(await controller.getBookById(1)).toEqual(expectedBook)
  })

  it('should return a book by ISBN', async () => {
    jest.spyOn(service, 'getBookByISBN').mockImplementation(async () => expectedBook)
    expect(await controller.getBookByISBN({ isbn: '123-456-789' })).toEqual(expectedBook)
  })
})
