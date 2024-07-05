import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BookDto, BookFilterDto, UpdateBookDto } from './dto'
import { plainToClass } from 'class-transformer'
import { getFilterConditions, getSortConditions } from './utils'

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(data: BookDto) {
    let book = await this.prisma.book.findUnique({ where: { isbn: data.isbn } })
    if (!book) {
      book = await this.createBook(data)
    }
    return book
  }

  async createBook(data: BookDto) {
    data = plainToClass(BookDto, data)
    const book = await this.prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        authorId: data.authorId,
        description: data.description ? data.description : null,
        publicationDate: data.publishedDate ? new Date(data.publishedDate) : null,
        imgUrl: data.imgUrl ? data.imgUrl : null,
        ratingAvg: data.ratingAvg ? data.ratingAvg : null,
        ratingCount: data.ratingCount ? data.ratingCount : null,
        categories: {
          connect: data.categories?.map((category) => ({ name: category })),
        },
      },
    })
    return book
  }

  async getAllBooks(page: number = 1, limit: number = 20, filter: BookFilterDto = {}) {
    const filterConditions = getFilterConditions(filter)
    const sortConditions = getSortConditions(filter)

    const where = {
      OR: [
        filterConditions,
        {
          isbn: {
            contains: filter.title,
            mode: 'insensitive',
          },
        },
      ],
    }

    const offset = (page - 1) * limit

    const books = await this.prisma.book.findMany({
      where,
      include: {
        categories: true,
        author: true,
        prices: true,
      },
      orderBy: sortConditions,
      skip: offset,
      take: limit,
    })

    const totalBooks = await this.prisma.book.count({
      where,
    })

    return {
      total: totalBooks,
      page: page,
      limit: limit,
      hasNextPage: totalBooks > offset + limit,
      data: books,
    }
  }

  async getBookById(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        categories: true,
        author: true,
        prices: true,
      },
    })
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
    return book
  }

  async getBookByISBN(isbn: string) {
    const book = await this.prisma.book.findUnique({
      where: { isbn },
      include: {
        categories: true,
        author: true,
        prices: true,
      },
    })
    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`)
    }
    return book
  }

  async getBookRecommendationsByISBN(isbn: string) {
    const book = await this.prisma.book.findUnique({
      where: { isbn },
      include: {
        categories: true,
        author: true,
      },
    })
    if (!book) {
      throw new NotFoundException(`Book with ISBN ${isbn} not found`)
    }
    const recommendations = await this.prisma.book.findMany({
      where: {
        categories: {
          some: {
            name: {
              in: book.categories.map((category) => category.name),
            },
          },
        },
        isbn: { not: isbn },
      },
      include: {
        categories: true,
        author: true,
        prices: true,
      },
      take: 5,
    })
    return recommendations
  }

  /**
   * Get KPIs (Key Performance Indicators) for books
   * @returns KPIs for books
   */
  async getBooksKpi() {
    const totalBooks = await this.prisma.book.count()
    const totalBooksMarkedAsDeleted = await this.prisma.book.count({
      where: { isDeleted: true },
    })
    const totalPrices = await this.prisma.price.count()
    const totalPricesMarkedAsDeleted = await this.prisma.price.count({
      where: { isDeleted: true },
    })
    const totalAuthors = await this.prisma.author.count()
    const totalCategories = await this.prisma.category.count()
    return {
      totalBooks,
      totalBooksMarkedAsDeleted,
      totalPrices,
      totalPricesMarkedAsDeleted,
      totalAuthors,
      totalCategories,
    }
  }

  async updateBook(id: number, data: UpdateBookDto) {
    const { title, authorId, isbn, publishedDate, description, imgUrl, categories } = data

    try {
      const updatedBook = await this.prisma.book.update({
        where: { id },
        data: {
          title,
          authorId,
          isbn,
          publicationDate: publishedDate,
          description,
          imgUrl,
          categories: {
            set: categories
              ? categories.map((category) => ({ name: category }))
              : undefined,
          },
        },
      })
      return updatedBook
    } catch (error) {
      throw new NotFoundException(`Book with id ${id} not found`)
    }
  }

  async deleteBook(id: number) {
    const deletedBook = await this.prisma.book.update({
      where: { id },
      data: { isDeleted: true },
    })
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }
    return deletedBook
  }

  async restoreBook(id: number) {
    const book = await this.prisma.book.update({
      where: { id },
      data: { isDeleted: false },
    })
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`)
    }
    return book
  }
}
