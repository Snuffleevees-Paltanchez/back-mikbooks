import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthorService } from './../../src/author/author.service'
import { AuthorDto, AuthorFilterDto } from './../../src/author/dto'

describe('AuthorService', () => {
  let authorService: AuthorService
  let prismaService: {
    author: {
      upsert: jest.Mock
      findMany: jest.Mock
      count: jest.Mock
    }
    $queryRaw: jest.Mock
  }

  beforeEach(async () => {
    prismaService = {
      author: {
        upsert: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      $queryRaw: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorService, { provide: PrismaService, useValue: prismaService }],
    }).compile()

    authorService = module.get<AuthorService>(AuthorService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('findOrCreate', () => {
    it('should create a new author if it does not exist', async () => {
      const authorData: AuthorDto = { name: 'John Doe' }

      prismaService.author.upsert.mockResolvedValueOnce({
        id: 1,
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      })

      const result = await authorService.findOrCreate(authorData)

      expect(prismaService.author.upsert).toHaveBeenCalledWith({
        where: { name: authorData.name },
        update: {},
        create: { name: authorData.name },
      })
      expect(result).toEqual(expect.objectContaining({ id: 1, name: 'John Doe' }))
    })
  })

  describe('getAllAuthors', () => {
    it('should return a paginated list of authors', async () => {
      const page = 1
      const limit = 50
      const filter: AuthorFilterDto = {}

      const filterConditions = {} // Mocked filter conditions

      const authors = [
        {
          id: 1,
          name: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
        {
          id: 2,
          name: 'Jane Smith',
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        },
      ] // Mocked authors

      const total = 2 // Mocked total count

      prismaService.author.findMany.mockResolvedValueOnce(authors)
      prismaService.author.count.mockResolvedValueOnce(total)

      const result = await authorService.getAllAuthors(page, limit, filter)

      expect(prismaService.author.findMany).toHaveBeenCalledWith({
        where: filterConditions,
        skip: 0,
        take: limit,
        select: {
          id: true,
          name: true,
          isDeleted: true,
        },
      })
      expect(prismaService.author.count).toHaveBeenCalledWith({
        where: filterConditions,
      })
      expect(result).toEqual({
        total: total,
        page: page,
        limit: limit,
        hasNextPage: false,
        data: authors,
      })
    })
  })

  describe('getAuthorsWithMostBooks', () => {
    it('should return authors with the most books', async () => {
      const authors = [
        { id: 1, name: 'John Doe', bookscount: 10 },
        { id: 2, name: 'Jane Smith', bookscount: 5 },
      ] // Mocked authors with book count

      prismaService.$queryRaw.mockResolvedValueOnce(authors)

      const result = await authorService.getAuthorsWithMostBooks()

      const stringifyAuthors = JSON.stringify(authors)

      expect(prismaService.$queryRaw).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(stringifyAuthors)
    })
  })
})
