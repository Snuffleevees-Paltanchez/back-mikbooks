import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsISBN,
  IsNumber,
  IsUrl,
  IsArray,
} from 'class-validator'

class DbDto {
  @IsNotEmpty()
  @IsString()
  platform: string

  @IsNotEmpty()
  @IsString()
  source: string

  @IsNotEmpty()
  @IsString()
  csv: string

  @IsNotEmpty()
  @IsString()
  admin: string
}

class csvDataDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  author: string

  @IsNotEmpty()
  @IsNumber()
  price: string

  @IsNotEmpty()
  @IsUrl()
  link: string

  @IsNotEmpty()
  @IsISBN()
  isbn: string

  @IsOptional()
  @IsString()
  description: string | null

  @IsOptional()
  @IsDate()
  publishedDate: Date | null

  @IsOptional()
  @IsUrl()
  imgUrl: string | null

  @IsOptional()
  @IsArray()
  categories: string | null

  @IsOptional()
  @IsNumber()
  ratingAvg: number | null

  @IsOptional()
  @IsNumber()
  ratingCount: number | null
}

export { DbDto, csvDataDto }
