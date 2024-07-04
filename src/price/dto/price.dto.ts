import {
  IsNotEmpty,
  MaxLength,
  IsUrl,
  IsNumber,
  IsDate,
  IsBoolean,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class PriceDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  bookId: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  platformId: number

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 13000 })
  price: number

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ example: '2021-01-01' })
  date: Date

  @IsNotEmpty()
  @IsUrl()
  @MaxLength(255)
  @ApiProperty({ example: 'https://example.com/book/1' })
  productUrl: string
}

class PriceDtoResponse extends PriceDto {
  @IsDate()
  @ApiProperty({ example: '2021-01-01' })
  createdAt: Date

  @IsDate()
  @ApiProperty({ example: '2021-01-01' })
  updatedAt: Date

  @IsBoolean()
  @ApiProperty({ example: true })
  isDeleted: boolean
}

class PriceDtoResponseChanged {
  @IsString()
  @ApiProperty({ example: 'Price updated successfully' })
  message: string

  @ApiProperty({ type: PriceDtoResponse })
  data: PriceDtoResponse
}
class EditPriceDto {
  @IsNumber()
  @ApiProperty({ example: 13000 })
  price: number
}

export { PriceDto, EditPriceDto, PriceDtoResponse, PriceDtoResponseChanged }
