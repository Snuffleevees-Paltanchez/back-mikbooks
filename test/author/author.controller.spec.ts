import { Test, TestingModule } from '@nestjs/testing'
import { AuthorController } from './../../src/author/author.controller'
import { AuthorService } from './../../src/author/author.service'
import {
  GetAuthorsDto,
  AuthorsResponse,
  AuthorWithBooksCountDto,
} from './../../src/author/dto'

describe('AuthorController', () => {
  let controller: AuthorController
  let service: AuthorService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorService,
          useValue: {
            getAllAuthors: jest.fn(),
            getAuthorsWithMostBooks: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthorController>(AuthorController)
    service = module.get<AuthorService>(AuthorService)
  })

  describe('getAllAuthors', () => {
    it('should return all authors', async () => {
      const expectedResult: AuthorsResponse = {
        total: 3,
        page: 1,
        limit: 10,
        hasNextPage: false,
        data: [
          { id: 1, name: 'Author 1', isDeleted: false },
          { id: 2, name: 'Author 2', isDeleted: false },
          { id: 3, name: 'Author 3', isDeleted: false },
        ],
      }

      jest.spyOn(service, 'getAllAuthors').mockResolvedValue(expectedResult)

      const query: GetAuthorsDto = { page: 1, limit: 10 }
      const result = await controller.getAllAuthors(query)

      expect(result).toEqual(expectedResult)
      expect(service.getAllAuthors).toHaveBeenCalledWith(1, 10, {})
    })
  })

  describe('getAuthorsWithMostBooks', () => {
    it('should return authors with most books', async () => {
      const expectedResult: AuthorWithBooksCountDto[] = [
        { id: 1, name: 'Author 1', bookscount: 10 },
        { id: 2, name: 'Author 2', bookscount: 8 },
        { id: 3, name: 'Author 3', bookscount: 6 },
      ]

      jest.spyOn(service, 'getAuthorsWithMostBooks').mockResolvedValue(expectedResult)

      const result = await controller.getAuthorsWithMostBooks()

      expect(result).toEqual(expectedResult)
      expect(service.getAuthorsWithMostBooks).toHaveBeenCalled()
    })
  })
})
