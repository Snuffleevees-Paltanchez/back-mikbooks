import {
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDate,
  IsBoolean,
} from 'class-validator'

class categoriesDto {
  @IsOptional()
  @IsString()
  categories: string | null
}

class categoryDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsDate()
  createdAt: Date

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date

  @IsNotEmpty()
  @IsBoolean()
  isDeleted: boolean
}

export { categoriesDto, categoryDto }
