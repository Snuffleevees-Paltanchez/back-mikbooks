import { Injectable } from '@nestjs/common'
import { csvDataDto } from './dto'
import { libraries } from './constants'
import { parse } from 'csv-parse'
import { AuthorService } from '../author/author.service'
import { PlatformService } from '../platform/platform.service'
import { BookService } from '../book/book.service'
import { PriceService } from '../price/price.service'
import { CategoryService } from '../category/category.service'

@Injectable()
export class DbService {
  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private platformService: PlatformService,
    private priceService: PriceService,
    private categoryService: CategoryService,
  ) {}

  async populate() {
    await this.loadCsvData(libraries.antartica)
    await this.loadCsvData(libraries.buscaLibre)
    await this.loadCsvData(libraries.contraPunto)
    await this.loadCsvData(libraries.feriaChilena)
  }

  async loadCsvData(library: { name: string; url: string; csv: string }) {
    const response = await fetch(library.csv)
    const csvData = await response.text()
    const data = await this.parseCsv(csvData)
    if (data.length === 0) {
      return
    }

    const platform = await this.platformService.findOrCreate({
      name: library.name,
      url: library.url,
    })
    for (const item of data) {
      try {
        await this.findOrCreate(item, platform.id)
      } catch (error) {
        console.error(error)
      }
    }
    return data
  }

  async parseCsv(csvText: string): Promise<csvDataDto[]> {
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    })

    return new Promise((resolve, reject) => {
      const records: csvDataDto[] = []

      parser.on('readable', function () {
        let record
        while ((record = parser.read()) !== null) {
          records.push({
            title: record.Title,
            author: record.Author,
            price: record.Price,
            link: record.Link,
            isbn: record.ISBN,
            description: record.Description,
            publishedDate: record.PublishedDate,
            imgUrl: record.ImgUrl,
            categories: record.Categories,
            ratingAvg: record.AvgRating,
            ratingCount: record.RatingsCount,
          })
        }
      })

      parser.on('end', () => {
        resolve(records)
      })

      parser.on('error', (err) => {
        console.error(err)
        reject([])
      })

      parser.write(csvText)
      parser.end()
    })
  }

  async findOrCreate(data: csvDataDto, platformId: number) {
    const author = await this.authorService.findOrCreate({ name: data.author })

    const categories = await this.categoryService.findOrCreate({
      categories: data.categories,
    })

    const book = await this.bookService.findOrCreate({
      ...data,
      authorId: author.id,
      categories: categories.map((category) => category.name),
    })

    await this.priceService.findOrCreate({
      bookId: book.id,
      platformId: platformId,
      price: parseFloat(data.price.replace(/[^0-9]/g, '')),
      date: new Date(),
      productUrl: data.link,
    })
  }
}
