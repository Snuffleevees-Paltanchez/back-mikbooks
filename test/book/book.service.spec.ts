import { Test, TestingModule } from '@nestjs/testing'
import { BookService } from '../../src/book/book.service'
import { BookDto } from '../../src/book/dto/book.dto'
import { PrismaService } from '../../src/prisma/prisma.service'

describe('BookService', () => {
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

  const testBook: BookDto = {
    title: 'Test Book',
    authorId: 1,
    isbn: '1234567890',
    description: 'Test Description',
    imgUrl: 'https://test.com/image.jpg',
    categories: ['Test Category'],
    publishedDate: new Date(),
    ratingAvg: 4.5,
    ratingCount: 100,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService, { provide: PrismaService, useValue: prisma }],
    }).compile()

    service = module.get<BookService>(BookService)
    prisma = module.get<typeof prisma>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a book', async () => {
    const expectedBook = {
      id: 1,
      ...testBook,
      publicationDate: testBook.publishedDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      categories: [],
      prices: [],
    }

    prisma.book.create.mockResolvedValue(expectedBook)

    const book = await service.createBook(testBook)
    expect(book).toEqual(expectedBook)
  })

  it('should return all books', async () => {
    const expectedBooks = {
      total: 1,
      page: 1,
      limit: 20,
      hasNextPage: false,
      data: [
        {
          id: 1,
          ...testBook,
          publicationDate: testBook.publishedDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
          categories: [],
          prices: [],
          author: {
            id: 1,
            name: 'Author Name',
            createdAt: new Date(),
            updatedAt: new Date(),
            isDeleted: false,
          },
        },
      ],
    }
    prisma.book.findMany.mockResolvedValue(expectedBooks.data)
    prisma.book.count.mockResolvedValue(expectedBooks.total)

    const books = await service.getAllBooks()
    expect(books).toEqual(expectedBooks)
  })

  it('should return a single book identified by its ID', async () => {
    const expectedBook = {
      id: 1,
      ...testBook,
      publicationDate: testBook.publishedDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      categories: [],
      prices: [],
      author: {
        id: 1,
        name: 'Author Name',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    }

    prisma.book.findUnique.mockResolvedValue(expectedBook)

    const foundBook = await service.getBookById(1)
    expect(foundBook).toEqual(expectedBook)
  })

  it('should return a single book identified by its ISBN', async () => {
    const expectedBook = {
      id: 1,
      ...testBook,
      publicationDate: testBook.publishedDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      categories: [],
      prices: [],
      author: {
        id: 1,
        name: 'Author Name',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    }

    prisma.book.findUnique.mockResolvedValue(expectedBook)

    const foundBook = await service.getBookByISBN(testBook.isbn)
    expect(foundBook).toEqual(expectedBook)
  })
})
