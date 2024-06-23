import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class AuthorDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

class AuthorDtoResponse {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsBoolean()
  isDeleted: boolean
}

class AuthorsResponse {
  @ApiProperty()
  total: number

  @ApiProperty()
  page: number

  @ApiProperty()
  limit: number

  @ApiProperty()
  hasNextPage: boolean

  @ApiProperty({ type: [AuthorDtoResponse] })
  data: AuthorDtoResponse[]
}

class AuthorFilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Filter by  Name' })
  name?: string
}

class GetAuthorsDto extends AuthorFilterDto {
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

export { AuthorDto, AuthorsResponse, AuthorFilterDto, GetAuthorsDto }
