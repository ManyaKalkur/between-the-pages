import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'
import './BrowsePage.css'

const PER_PAGE = 20

function transformBook(item) {
  const info= item?.volumeInfo ?? {}
  const cover= info.imageLinks?.thumbnail?.replace('http:', 'https:')?? null
  return {
    id:item.id,
    title:info.title?? 'Unknown Title',
    author:info.authors?.[0]?? 'Unknown Author',
    cover,
    rating:info.averageRating?? null,
    ratingsCount:info.ratingsCount?? 0,
    genre:info.categories?.[0]?.split(' / ')[0]?? null,
    year:info.publishedDate?.split('-')[0]?? null,
    language:info.language ?? 'en',
    description:info.description ?? '',
    isFamous:FAMOUS.has(info.title ?? ''),
  }
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

export default function BrowsePage() {
  const [query,setQuery]= useState('')
  const [books,setBooks]= useState([])
  const [total,setTotal]= useState(0)
  const [page,setPage]= useState(1)
  const [view,setView]= useState('grid')
  const [loading,setLoading]= useState(false)
  const [error,setError]= useState(null)
  const [filters,setFilters]= useState({
    genre: '', rating: '', year: '', language: '', famousOnly: false,
  })
  const debounce= useRef(null)
  const fetchBooks= useCallback(async (q, f, p)=> {
    setLoading(true)
    setError(null)
    try {
      const baseQ= q.trim()|| 'subject:fiction'
      const fullQ= f.genre? `${baseQ}+subject:${f.genre}`: baseQ
      const params= new URLSearchParams({
        q:fullQ,
        maxResults:PER_PAGE,
        startIndex:(p-1)* PER_PAGE,
        printType:'books',
        orderBy:q.trim()? 'relevance':'newest',
      })
      if (f.language) params.set('langRestrict', f.language)
      const apiKey= import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
      if (apiKey) params.set('key', apiKey)
      const res= await fetch(
        `https://www.googleapis.com/books/v1/volumes?${params}`
      )
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data= await res.json()
      let items= (data.items?? []).map(transformBook)
      if (f.famousOnly) items= items.filter(b=> b.isFamous)
      if (f.rating)items= items.filter(b=> b.rating != null && b.rating>= +f.rating)
      if (f.year)items= items.filter(b=> b.year=== f.year)
      setBooks(items)
      setTotal(Math.min(data.totalItems?? 0, 200))
    } catch (err) {
      console.error(err)
      setError('Could not load books')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(()=> {
    clearTimeout(debounce.current)
    debounce.current= setTimeout(()=> fetchBooks(query, filters, page),350)
    return ()=> clearTimeout(debounce.current)
  }, [query, filters, page, fetchBooks])
  const totalPages= Math.ceil(total/PER_PAGE)
  const handleSearch=e=> {
    setQuery(e.target.value)
    setPage(1)
  }
  const handleFilters=f=> {
    setFilters(f)
    setPage(1)
  }
  const handlePage=p=> {
    setPage(p)
    window.scrollTo({ top:0,behavior:'smooth' })
  }
  return (
    <div className="browse">
      <Navbar/>
      <section className="browse__hero">
        <div className="browse__hero-inner">
          <p className="eyebrow">Discover</p>
          <h1 className="browse__heading">Browse Books</h1>
          <div className="browse__search-wrap">
            <span className="browse__search-icon"><SearchIcon/></span>
            <input
              className="browse__search"
              type="search"
              placeholder="Search by title, author, or keyword…"
              value={query}
              onChange={handleSearch}
              autoComplete="off"
            />
            {query && (
              <button
                className="browse__search-clear"
                onClick={()=> { setQuery(''); setPage(1) }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>
      <FilterBar
        filters={filters}
        onChange={handleFilters}
        view={view}
        onViewChange={setView}
        total={total}
        loading={loading}
      />
      <section className="browse__results">
        {error && <p className="browse__error">{error}</p>}
        {loading ? (
          <div className={`browse__grid browse__grid--${view}`}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`book-skel ${i%7=== 0? 'book-skel--wide': ''}`}/>
            ))}
          </div>
        ) : books.length=== 0 && !error? (
          <div className="browse__empty">
            <p className="browse__empty-icon">📚</p>
            <p className="browse__empty-title">No books found</p>
            <p className="browse__empty-sub">Try a different keyword or adjust the filters</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${query}-${JSON.stringify(filters)}-${page}`}
              className={`browse__grid browse__grid--${view}`}
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              transition={{duration:0.25}}
            >
              {books.map((book,i)=> (
                <motion.div
                  key={book.id}
                  className={
                    book.isFamous && view=== 'grid'?
                      'browse__item browse__item--famous'
                      :'browse__item'
                  }
                  initial={{opacity:0,y:14}}
                  animate={{opacity:1,y:0}}
                  transition={{delay:i*0.025,duration:0.38}}
                >
                  <BookCard book={book} view={view}/>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && totalPages>1 && (
          <Pagination current={page} total={totalPages} onChange={handlePage}/>
        )}
      </section>
    </div>
  )
}