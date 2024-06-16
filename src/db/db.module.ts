import { Module } from '@nestjs/common'
import { DbController } from './db.controller'
import { DbService } from './db.service'
import { AuthorModule } from 'src/author/author.module'
import { BookModule } from 'src/book/book.module'
import { CategoryModule } from 'src/category/category.module'
import { PlatformModule } from 'src/platform/platform.module'
import { PriceModule } from 'src/price/price.module'

@Module({
  controllers: [DbController],
  providers: [DbService],
  imports: [AuthorModule, BookModule, CategoryModule, PlatformModule, PriceModule],
})
export class DbModule {}
