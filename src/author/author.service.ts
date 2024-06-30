import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthorDto, AuthorFilterDto } from './dto'
import { applyFilterMapping } from '../utils'

const filterMappings = {
  name: (value: string) => ({ contains: value, mode: 'insensitive' }),
}

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(authorData: AuthorDto) {
    return this.prisma.author.upsert({
      where: { name: authorData.name },
      update: {},
      create: { name: authorData.name },
    })
  }

  async getAllAuthors(
    page: number = 1,
    limit: number = 50,
    filter: AuthorFilterDto = {},
  ) {
    const filterConditions = applyFilterMapping(filter, filterMappings)

    const offset = (page - 1) * limit

    const authors = await this.prisma.author.findMany({
      where: filterConditions,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        isDeleted: true,
      },
    })

    const total = await this.prisma.author.count({
      where: filterConditions,
    })

    return {
      total: total,
      page: page,
      limit: limit,
      hasNextPage: total > offset + limit,
      data: authors,
    }
  }

  async getAuthorsWithMostBooks() {
    // We use a raw query to get the authors with the most books.
    // I tried to do this using Prisma, but I couldn't find a way to do it.
    // Sorry :c
    const authors = await this.prisma.$queryRaw`
      SELECT authors.id, authors.name, COUNT(books.id) as booksCount
      FROM authors
      JOIN books ON authors.id = books."authorId"
      WHERE books."isDeleted" = false
      GROUP BY authors.id
      ORDER BY booksCount DESC
      LIMIT 10
    `

    // Given that the count of books is a bigint, we need to do this
    // custom conversion to avoid JSON serialization issues
    return json(authors)
  }
}

const json = (param: any): any =>
  JSON.stringify(param, (key, value) =>
    typeof value === 'bigint' ? parseInt(value.toString()) : value,
  )
