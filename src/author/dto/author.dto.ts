import { IsString, IsNotEmpty } from 'class-validator'

class authorDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export { authorDto }
