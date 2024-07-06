export type Filter = {
  [key: string]: any
}

export type FilterMapping = {
  [key: string]: (value: any) => any
}

/**
 * Apply filter mapping to filter object
 * @param filter Filter object
 * @param filterMappings Filter mappings
 * @returns Filter conditions to be used in Prisma query
 * @example
 * const filter = {
 *  title: 'Book Title',
 *  authorId: 1,
 * }
 * const filterMappings = {
 *  title: (value: string) => ({ contains: value, mode: 'insensitive' }),
 *  authorId: (value: number) => value,
 * }
 * const filterConditions = applyFilterMapping(filter, filterMappings)
 * const totalBooks = await this.prisma.book.count({where: filterConditions})
 */
export const applyFilterMapping = (filter: Filter, filterMappings: FilterMapping) => {
  const filterConditions: Filter = {}

  for (const key in filter) {
    const value = filter[key]
    if (value !== undefined && value !== null && value !== '') {
      const filterMapping = filterMappings[key]
      if (filterMapping) {
        filterConditions[key] = filterMapping(value)
      }
    }
  }
  return filterConditions
}

/**
 * Add not null to filter mapping. Useful if you have sort conditions and you don't want to
 * include null values.
 * @param allFilters Filter object
 * @param filtersNotToBeNull Filters not to be null
 * @returns Filter object with specified filters not to be null
 * @example
 * const allFilters = {
 * title: 'Book Title',
 * authorId: 1,
 * }
 * const filtersNotToBeNull = ['ratingCount']
 * const filters = addNotNullToFilterMapping(allFilters, filtersNotToBeNull)
 * const books = await this.prisma.book.findMany({where: filters})
 * const totalBooks = await this.prisma.book.count({where: filters})
 */
export const excludeNullValuesFromFilters = (
  allFilters: Filter,
  filtersNotToBeNull: string[],
) => {
  const filters = { ...allFilters }
  filtersNotToBeNull.forEach((filter) => {
    filters[filter] = {
      not: null,
      ...filters[filter],
    }
  })
  return filters
}
