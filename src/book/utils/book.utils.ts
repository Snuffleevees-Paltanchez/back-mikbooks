import {
  applyFilterMapping,
  excludeNullValuesFromFilters,
} from '../../common/utils/common.filter.utils'
import { BookFilterDto } from '../dto/book.dto'

/**
 * Filter mappings for book
 */
const filterMappings = {
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

const parseFilter = (filter: BookFilterDto) => ({
  ...filter,
  author: filter.authorName,
  categories: filter.category,
  prices: { minPrice: filter.minPrice, maxPrice: filter.maxPrice },
  ratingAvg: { minRatingAvg: filter.minRatingAvg, maxRatingAvg: filter.maxRatingAvg },
})

const parseSort = (filter: BookFilterDto) => ({
  ratingAvg: filter.sortByRating,
  ratingCount: filter.sortByRatingCount,
})

const sortMappings = {
  ratingAvg: (value: string) => value,
  ratingCount: (value: string) => value,
}

/**
 * Get filter conditions for book
 * @param queryFilters
 */
export const getFilterConditions = (
  queryFilters: BookFilterDto,
  sortConditions: Record<string, any>,
) => {
  const sortConditionsKeys = Object.keys(sortConditions)
  const filters = applyFilterMapping(parseFilter(queryFilters), filterMappings)
  return excludeNullValuesFromFilters(filters, sortConditionsKeys)
}

/**
 * Get sort conditions for book
 * @param queryFilters
 */
export const getSortConditions = (queryFilters: BookFilterDto) =>
  applyFilterMapping(parseSort(queryFilters), sortMappings)
