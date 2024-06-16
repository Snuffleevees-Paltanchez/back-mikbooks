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
} from 'class-validator'

export class bookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string

  @IsNotEmpty()
  @IsNumber()
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
