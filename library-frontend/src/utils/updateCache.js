export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    const seen = new Set()
    return a.filter((item) => {
      const k = item.name
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook))
    }
  })
}
