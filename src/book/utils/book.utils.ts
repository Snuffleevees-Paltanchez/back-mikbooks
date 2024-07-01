import { BookFilterDto } from '../dto/book.dto'

/**
 * Filter mappings for book
 */
export const filterMappings = {
  title: (value: string) => ({ contains: value, mode: 'insensitive' }),
  authorId: (value: number) => value,
  author: (value: string) => ({ name: { contains: value, mode: 'insensitive' } }),
  isbn: (value: string) => value,
  categories: (value: string) => ({
    some: { name: { contains: value, mode: 'insensitive' } },
  }),
  prices: ({ minPrice, maxPrice }: { minPrice?: number; maxPrice?: number }) => ({
    some: {
      price: {
        gte: minPrice ? minPrice : undefined,
        lte: maxPrice ? maxPrice : undefined,
      },
    },
  }),
  ratingCount: (value: number) => ({ gt: value }),
  ratingAvg: ({
    minRatingAvg,
    maxRatingAvg,
  }: {
    minRatingAvg?: number
    maxRatingAvg?: number
  }) => ({
    gte: minRatingAvg ? minRatingAvg : undefined,
    lte: maxRatingAvg ? maxRatingAvg : undefined,
  }),
  isDeleted: (value: string) => value === 'true',
}

export const parsedFilter = (filter: BookFilterDto) => ({
  ...filter,
  author: filter.authorName,
  categories: filter.category,
  prices: { minPrice: filter.minPrice, maxPrice: filter.maxPrice },
  ratingAvg: { minRatingAvg: filter.minRatingAvg, maxRatingAvg: filter.maxRatingAvg },
})

export const parseSort = (filter: BookFilterDto) => ({
  ratingAvg: filter.sortByRating,
})

export const sortMappings = {
  ratingAvg: (value: string) => value,
}
