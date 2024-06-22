import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class CategoriesDto {
  @IsOptional()
  @IsString()
  categories: string | null
}

class CategoryDto {
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

class CategoryDtoResponse {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Category Name' })
  name: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: false })
  isDeleted: boolean
}

class CategoriesResponse {
  @ApiProperty()
  total: number

  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty({ type: [CategoryDtoResponse] })
  data: CategoryDtoResponse[]
}

class CategoryFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Filter by  Name' })
  name?: string
}

class GetCategoriesDto extends CategoryFilterDto {
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

export {
  CategoriesDto,
  CategoryDto,
  CategoriesResponse,
  CategoryFilterDto,
  GetCategoriesDto,
}
