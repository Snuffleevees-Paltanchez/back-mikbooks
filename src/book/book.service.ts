import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { BookDto, BookFilterDto, UpdateBookDto } from './dto'

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
    const book = await this.prisma.book.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        authorId: data.authorId,
        description: data.description ? data.description : null,
        publicationDate: data.publishedDate ? new Date(data.publishedDate) : null,
        imgUrl: data.imgUrl ? data.imgUrl : null,
        categories: {
          connect: data.categories?.map((category) => ({ name: category })),
        },
      },
    })
    return book
  }

  async getAllBooks(page: number = 1, limit: number = 20, filter: BookFilterDto = {}) {
    const { title, authorId, authorName, isbn, category, minPrice, maxPrice } = filter

    const filterConditions: any = {}

    if (title) {
      filterConditions.title = { contains: title, mode: 'insensitive' }
    }

    filterConditions.authorId = authorId ? authorId : undefined

    if (authorName) {
      filterConditions.author = {
        name: { contains: authorName, mode: 'insensitive' },
      }
    }
    filterConditions.isbn = isbn ? isbn : undefined

    if (category) {
      filterConditions.categories = {
        some: { name: { contains: category, mode: 'insensitive' } },
      }
    }
    if (minPrice || maxPrice) {
      filterConditions.prices = {
        some: {
          price: {},
        },
      }
      if (minPrice) {
        filterConditions.prices.some.price.gte = minPrice
      }
      if (maxPrice) {
        filterConditions.prices.some.price.lte = maxPrice
      }
    }

    const offset = (page - 1) * limit

    const books = await this.prisma.book.findMany({
      where: filterConditions,
      include: {
        categories: true,
        author: true,
        prices: true,
      },
      skip: offset,
      take: limit,
    })

    const totalBooks = await this.prisma.book.count({
      where: filterConditions,
    })

    return {
      total: totalBooks,
      page: page,
      limit: limit,
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
    const deletedBook = await this.prisma.book.delete({
      where: { id },
    })
    return deletedBook
  }
}
