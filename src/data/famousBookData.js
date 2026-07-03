export function getFamousData(title) {
  if (!title) return null
  const direct= FAMOUS_BOOKS_DATA[title]
  if (direct) return direct
  const key= Object.keys(FAMOUS_BOOKS_DATA).find(k=>
    title.toLowerCase().includes(k.toLowerCase())||k.toLowerCase().includes(title.toLowerCase())
  )
  return key ? FAMOUS_BOOKS_DATA[key] : null
}