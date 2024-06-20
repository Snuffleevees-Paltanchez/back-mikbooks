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
} from 'class-validator'

import { Type } from 'class-transformer'

export class BookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  authorId: number

  @IsNotEmpty()
  @IsISBN()
  @MaxLength(13)
  isbn: string

  @IsOptional()
  @IsDate()
  publishedDate: Date | null

  @IsOptional()
  @IsString()
  description: string | null

  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imgUrl: string | null

  @IsOptional()
  @IsArray()
  categories: string[] | null
}

export class BookFilterDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number

  @IsOptional()
  @IsString()
  authorName?: string

  @IsOptional()
  @IsISBN()
  isbn?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number
}

export class GetBooksDto extends BookFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number
}

export class GetBookByISBNDto {
  @IsNotEmpty()
  @IsISBN()
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
