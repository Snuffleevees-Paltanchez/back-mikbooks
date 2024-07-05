import { IsNumber } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { BookDto } from './book.dto'

export class BooksKpi {
  @IsNumber()
  @ApiProperty()
  totalBooks: number

  @IsNumber()
  @ApiProperty()
  totalBooksMarkedAsDeleted: number

  @IsNumber()
  @ApiProperty()
  totalPrices: number

  @IsNumber()
  @ApiProperty()
  totalPricesMarkedAsDeleted: number

  @IsNumber()
  @ApiProperty()
  totalAuthors: number

  @IsNumber()
  @ApiProperty()
  totalCategories: number
}

export class BookResponse {
  @IsNumber()
  @ApiProperty()
  id: number
}

export class BooksResponse {
  @ApiProperty()
  total: number

  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  hasNextPage: boolean

  @ApiProperty({ type: [BookDto] })
  data: BookDto[]
}

// TODO: create a BookResponse class instead of using BookDto
// this class should use the BookDto properties and add Category and Author properties DTOs
