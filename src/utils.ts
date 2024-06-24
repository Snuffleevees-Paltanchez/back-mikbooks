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
