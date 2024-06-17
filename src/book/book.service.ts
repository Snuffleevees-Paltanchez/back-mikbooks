import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { BookDto } from './dto'

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(data: BookDto) {
    let book = await this.prisma.book.findUnique({ where: { isbn: data.isbn } })
    if (!book) {
      book = await this.prisma.book.create({
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
    }
    return book
  }
  async updateBook(id: number, data: BookDto) {
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
