import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

class platformDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  url: string
}

export { platformDto }
