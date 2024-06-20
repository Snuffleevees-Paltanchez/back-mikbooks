import { IsNotEmpty, IsNumber, IsOptional, IsDate, IsBoolean } from 'class-validator'

export class FavoriteDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsNumber()
  bookId: number

  @IsOptional()
  @IsDate()
  createdAt: Date | null

  @IsOptional()
  @IsDate()
  updatedAt: Date | null

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean | null
}

export class UpdateFavoriteDto {
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsNumber()
  bookId: number

  @IsOptional()
  @IsDate()
  createdAt: Date | null

  @IsOptional()
  @IsDate()
  updatedAt: Date | null

  @IsOptional()
  @IsBoolean()
  isDeleted: boolean | null
}
