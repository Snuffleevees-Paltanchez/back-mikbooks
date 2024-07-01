import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { BookModule } from './book/book.module'
import { PlatformModule } from './platform/platform.module'
import { FavoriteModule } from './favorite/favorite.module'
import { PriceModule } from './price/price.module'
import { AuthorModule } from './author/author.module'
import { DbModule } from './db/db.module'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    BookModule,
    PlatformModule,
    FavoriteModule,
    PriceModule,
    AuthorModule,
    DbModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
