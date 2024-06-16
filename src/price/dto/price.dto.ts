import {
  IsNotEmpty,
  MaxLength,
  IsUrl,
  IsNumber,
  IsDecimal,
  IsDate,
} from 'class-validator'

class priceDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number

  @IsNotEmpty()
  @IsNumber()
  platformId: number

  @IsNotEmpty()
  @IsDecimal()
  price: number

  @IsNotEmpty()
  @IsDate()
  date: Date

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(255)
  productUrl: string
}

export { priceDto }
