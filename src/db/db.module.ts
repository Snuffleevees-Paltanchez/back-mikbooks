import { Module } from '@nestjs/common'
import { DbController } from './db.controller'
import { DbService } from './db.service'
import { AuthorModule } from '../author/author.module'
import { BookModule } from '../book/book.module'
import { CategoryModule } from '../category/category.module'
import { PlatformModule } from '../platform/platform.module'
import { PriceModule } from '../price/price.module'

@Module({
  controllers: [DbController],
  providers: [DbService],
  imports: [AuthorModule, BookModule, CategoryModule, PlatformModule, PriceModule],
})
export class DbModule {}
