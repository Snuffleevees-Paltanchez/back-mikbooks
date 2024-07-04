import { IsNotEmpty, MaxLength, IsUrl, IsNumber, IsDate } from 'class-validator'

class PriceDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number

  @IsNotEmpty()
  @IsNumber()
  platformId: number

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsDate()
  date: Date

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(255)
  productUrl: string
}

class EditPriceDto {
  @IsNumber()
  price: number
}

export { PriceDto, EditPriceDto }
