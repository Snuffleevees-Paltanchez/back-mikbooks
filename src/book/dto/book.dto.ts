import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsISBN,
  IsDate,
  IsOptional,
  IsUrl,
  IsArray,
  MaxLength,
  Min,
  IsInt,
  Max,
} from 'class-validator'

import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class BookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @ApiProperty({ example: 'Book Title' })
  title: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 1 })
  authorId: number

  @IsNotEmpty()
  @IsISBN()
  @MaxLength(13)
  @ApiProperty({ example: '9783161484100' })
  isbn: string

  @IsOptional()
  @IsDate()
  @ApiProperty({ example: '2021-01-01', nullable: true })
  publishedDate: Date | null

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Book description', nullable: true })
  description: string | null

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  @ApiProperty({ example: 'https://example.com/book.jpg', nullable: true })
  imgUrl: string | null

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 4.5, nullable: true })
  ratingAvg: number | null

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 100, nullable: true })
  ratingCount: number | null

  @IsOptional()
  @IsArray()
  @ApiProperty({ example: ['Fiction', 'Thriller'], nullable: true })
  categories: string[] | null
}

export class BookFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Filter by  Title' })
  title?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Filter by author ID' })
  authorId?: number

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Filter by author name' })
  authorName?: string

  @IsOptional()
  @IsISBN()
  @ApiProperty({ required: false, description: 'Filter by ISBN' })
  isbn?: string

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Filter by category' })
  category?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ required: false, description: 'Filter by minimum price' })
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ required: false, description: 'Filter by maximum price' })
  maxPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ required: false, description: 'Filter by minimum rating count' })
  ratingCount?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  @ApiProperty({ required: false, description: 'Filter by minimum rating average' })
  minRatingAvg?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  @ApiProperty({ required: false, description: 'Filter by maximum rating average' })
  maxRatingAvg?: number

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Sort by price' })
  sortByPrice?: 'asc' | 'desc'

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Sort by rating' })
  sortByRating?: 'asc' | 'desc'

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, description: 'Sort by rating count' })
  sortByRatingCount?: 'asc' | 'desc'

  // We can't use IsBoolean here because the query parameter is a string
  @IsOptional()
  @ApiProperty({ required: false, description: 'Filter by deleted status' })
  isDeleted?: string
}

export class GetBooksDto extends BookFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ required: false, description: 'Page number' })
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ required: false, description: 'Number of items per page' })
  limit?: number
}

export class GetBookByISBNDto {
  @IsNotEmpty()
  @IsISBN()
  @ApiProperty({ example: '9789877978889' })
  isbn: string
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string

  @IsOptional()
  @IsNumber()
  authorId?: number

  @IsOptional()
  @IsISBN()
  @MaxLength(13)
  isbn?: string

  @IsOptional()
  @IsDate()
  publishedDate?: Date | null

  @IsOptional()
  @IsString()
  description?: string | null

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imgUrl?: string | null

  @IsOptional()
  @IsArray()
  categories?: string[] | null
}
