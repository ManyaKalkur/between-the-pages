import { useState, useEffect} from 'react'
import { useParams, Link, useNavigate} from 'react-router-dom'
import { motion, AnimatePresence} from 'framer-motion'
import Navbar from '../components/Navbar'
import { FAMOUS_TITLES, getFamousData} from '../data/famousBookData'
import './BookDetailPage.css'
const API_KEY= import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

function transformBook(data) {
  const info= data?.volumeInfo ?? {}
  return {
    id:data.id,
    title:info.title ??'Unknown Title',
    author:info.authors?.[0] ??'Unknown Author',
    allAuthors:info.authors ??[],
    cover:info.imageLinks?.extraLarge?.replace('http:','https:')
            ?? info.imageLinks?.large?.replace('http:','https:')
            ?? info.imageLinks?.thumbnail?.replace('http:','https:')
            ?? null,
    rating:info.averageRating?? null,
    ratingsCount:info.ratingsCount?? 0,
    genre:info.categories?.[0]?.split('/')[0]?? null,
    year:info.publishedDate?.split('-')[0] ?? null,
    publisher:info.publisher?? null,
    pages:info.pageCount?? null,
    language:info.language?? 'en',
    description:info.description?? '',
    isbn:info.industryIdentifiers?.find(i=> i.type=== 'ISBN_13')?.identifier?? null,
    isFamous:FAMOUS_TITLES.has(info.title ?? ''),
  }
}

function Stars({ rating, count }) {
  if (!rating) return null
  return (
    <div className="bdp-stars">
      {Array.from({length:5 }).map((_,i)=> (
        <span key={i} className={i < Math.round(rating) ? 'bdp-star bdp-star--on':'bdp-star'}>★</span>
      ))}
      <span className="bdp-stars__num">{rating.toFixed(1)}</span>
      {count > 0 && <span className="bdp-stars__count">({count.toLocaleString()})</span>}
    </div>
  )
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="bdp-star-picker" role="group" aria-label="Star rating">
      {[1,2,3,4,5].map(n => (
        <button
          key={n} type="button"
          className={`bdp-star-pick ${n <= (hover || value)? 'bdp-star-pick--on':''}`}
          onMouseEnter={()=> setHover(n)}
          onMouseLeave={()=> setHover(0)}
          onClick={()=> onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >★</button>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const [revealed, setRevealed]= useState(!review.spoiler)
  return (
    <article className="bdp-review">
      <div className="bdp-review__top">
        <div className="bdp-review__avatar">{review.initials}</div>
        <div className="bdp-review__meta">
          <p className="bdp-review__name">{review.name}</p>
          <p className="bdp-review__date">{review.date}</p>
        </div>
        <Stars rating={review.stars}/>
      </div>
      {review.spoiler && !revealed ? (
        <button className="bdp-review__spoiler-btn" onClick={()=> setRevealed(true)}>
          Contains spoilers. Click to reveal
        </button>
      ):(
        <p className="bdp-review__text">"{review.text}"</p>
      )}
    </article>
  )
}
function SectionHead({eyebrow,title }) {
  return (
    <div className="bdp-section-head">
      <p className="eyebrow bdp-eyebrow">{eyebrow}</p>
      <h2 className="bdp-section-title">{title}</h2>
      <div className="bdp-section-rule"/>
    </div>
  )
}

const MOSAIC_COLORS= [
  '#42303D', '#363B2E', '#7E6377', '#779273','#42303D', '#C4A882',
]
function PinterestMosaic() {
  return (
    <div className="bdp-pinterest-mosaic">
      {MOSAIC_COLORS.map((c, i)=> (
        <div key={i} className="bdp-pinterest-tile" style={{background:c}}/>
      ))}
    </div>
  )
}

export default function BookDetailPage() {
  const {id }= useParams()
  const navigate = useNavigate()
  const [book,setBook]= useState(null)
  const [loading,setLoading]= useState(true)
  const [error,setError]= useState(null)
  const [reviewStars,setReviewStars]= useState(0)
  const [reviewText,setReviewText]= useState('')
  const [reviewSpoiler,setReviewSpoiler]= useState(false)
  const [localReviews,setLocalReviews]= useState([])
  const [descExpanded,setDescExpanded]= useState(false)

  useEffect(()=> {
    const run= async ()=> {
      setLoading(true)
      setError(null)
      try {
        const qs= API_KEY ? `?key=${API_KEY}`: ''
        const res= await fetch(`https://www.googleapis.com/books/v1/volumes/${id}${qs}`)
        if (!res.ok) throw new Error(`Failed to load book (${res.status})`)
        const data= await res.json()
        setBook(transformBook(data))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const submitReview= e=> {
    e.preventDefault()
    if (!reviewStars|| !reviewText.trim()) return
    setLocalReviews(prev=> [{
      id:Date.now(),
      name:'You',
      initials:'YO',
      stars:reviewStars,
      text:reviewText.trim(),
      spoiler:reviewSpoiler,
      date:'Just now',
    }, ...prev])
    setReviewStars(0)
    setReviewText('')
    setReviewSpoiler(false)
  }

  if (loading) return (
    <div className="bdp">
      <Navbar/>
      <div className="bdp__layout">
        <aside className="bdp__left"><div className="bdp-skel bdp-skel--cover"/></aside>
        <main  className="bdp__right">
          <div className="bdp-skel bdp-skel--line bdp-skel--title"/>
          <div className="bdp-skel bdp-skel--line"/>
          <div className="bdp-skel bdp-skel--line" style={{width:'60%'}}/>
        </main>
      </div>
    </div>
  )

  if (error) return (
    <div className="bdp">
      <Navbar/>
      <div className="bdp__error">
        <p>{error}</p>
        <button className="btn btn--outline" onClick={()=> navigate(-1)}>Go back</button>
      </div>
    </div>
  )

  if (!book) return null
  const famousData= book.isFamous?getFamousData(book.title):null
  const allReviews= [...localReviews, ...(famousData?.reviews?? [])]
  const shortDesc= book.description.slice(0, 320)
  const needsExpand= book.description.length>320

  return (
    <div className="bdp">
      <Navbar/>
      <div className="bdp__layout">
        <motion.aside
          className="bdp__left"
          initial={{opacity:0,x:-20}}
          animate={{opacity:1,x:0}}
          transition={{ duration:0.6}}>
          <div className="bdp__cover-wrap">
            {book.cover ? (
              <img src={book.cover} alt={book.title} className="bdp__cover-img"/>
            ) : (
              <div className="bdp__cover-fallback">
                <span>{book.title.split(' ').slice(0, 2).map(w => w[0]).join('')}</span>
              </div>
            )}
            {book.isFamous && (
              <div className="bdp__famous-badge">
                Experience
              </div>
            )}
          </div>
          <div className="bdp__left-meta">
            <h1 className="bdp__title">{book.title}</h1>
            <p className="bdp__author">
              by <span>{book.allAuthors.join(',')}</span>
            </p>
            <Stars rating={book.rating} count={book.ratingsCount}/>
            <div className="bdp__tags">
              {book.genre && <span className="bdp__tag">{book.genre}</span>}
              {book.year && <span className="bdp__tag">{book.year}</span>}
              {book.pages && <span className="bdp__tag">{book.pages} pages</span>}
              <span className="bdp__tag">{book.language.toUpperCase()}</span>
            </div>
            {book.publisher && (
              <p className="bdp__publisher">Published by {book.publisher}</p>
            )}
            <div className="bdp__left-actions">
              <button className="btn btn--sage bdp__shelf-btn">+ Add to Shelf</button>
              <button className="btn btn--ghost bdp__share-btn" title="Share">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
            <Link to="/books" className="bdp__back">Back to Browse</Link>
          </div>
        </motion.aside>
        <motion.main
          className="bdp__right"
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.6,delay:0.1}}>
          {famousData?.quotes?.length > 0 && (
            <section className="bdp__section bdp__quotes">
              <SectionHead eyebrow="Words that stay" title="Notable Quotes" />
              <div className="bdp-quote-list">
                {famousData.quotes.map((q, i) => (
                  <blockquote key={i} className="bdp-quote">
                    <span className="bdp-quote__mark" aria-hidden="true">"</span>
                    <p className="bdp-quote__text">{q.text}</p>
                    <footer className="bdp-quote__source">{q.source}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          )}
          {book.isFamous && (
            <section className="bdp__section">
              <SectionHead eyebrow="Soundtrack your read" title="Playlist"/>
              <div className="bdp-spotify">
                <div className="bdp-spotify__label">
                  <span>Curated for this book</span>
                  <button className="bdp-embed-add-btn">+ Add your playlist</button>
                </div>
                <iframe
                  className="bdp-spotify__frame"
                  src={`https://open.spotify.com/embed/playlist/${famousData?.spotifyPlaylistId?? '37i9dQZF1DX4sWSpwq3LiO'}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify playlist"/>
                <p className="bdp-embed-note">
                  Placeholder playlist: the official one will be curated soon.
                </p>
              </div>
            </section>
          )}
          {book.isFamous && (
            <section className="bdp__section">
              <SectionHead eyebrow="Visual world" title="Moodboard" />
              <div className="bdp-pinterest">
                <div className="bdp-spotify__label">
                  <span>Aesthetic &amp; inspiration</span>
                  <button className="bdp-embed-add-btn">+ Add your board</button>
                </div>
                <PinterestMosaic/>
                <a
                  href={famousData?.pinterestUrl??'https://pinterest.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bdp-pinterest__link">
                  View full moodboard on Pinterest
                </a>
              </div>
            </section>
          )}
          {book.isFamous && (
            <section className="bdp__section">
              <div className="bdp-experience-cta">
                <div className="bdp-experience-cta__badge">
                  Cinematic Experience
                </div>
                <h3 className="bdp-experience-cta__title">
                  Step inside <em>{book.title}</em>
                </h3>
                <p className="bdp-experience-cta__sub">
                  A 30-second immersive parallax experience with ambient sound,
                  layered visuals, and the world of this book brought to life.
                </p>
                <Link
                  to={`/experiences/${id}`}
                  className="btn bdp-experience-cta__btn"
                >
                  Enter Experience
                </Link>
              </div>
            </section>
          )}
          {book.description && (
            <section className="bdp__section">
              <SectionHead eyebrow="About this book" title="Summary"/>
              <div className="bdp-summary">
                <p className="bdp-summary__text">
                  {descExpanded? book.description:shortDesc}
                  {needsExpand && !descExpanded && '…'}
                </p>
                {needsExpand && (
                  <button
                    className="bdp-summary__toggle"
                    onClick={()=> setDescExpanded(v=>!v)}
                  >
                    {descExpanded?'Show less ^':'Read more v'}
                  </button>
                )}
                <p className="bdp-summary__source">
                  Source: Google Books
                  {' · '}
                  <span className="bdp-summary__gemini">
                    Gemini AI summary coming soon
                  </span>
                </p>
              </div>
            </section>
          )}
          {famousData?.funFacts?.length>0 && (
            <section className="bdp__section">
              <SectionHead eyebrow="Did you know?" title="Fun Facts"/>
              <ul className="bdp-facts">
                {famousData.funFacts.map((f,i)=> (
                  <li key={i} className="bdp-fact">
                    <span className="bdp-fact__icon" aria-hidden="true"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="bdp__section">
            <SectionHead eyebrow="Reader voices" title="Reviews"/>
            {allReviews.length>0? (
              <div className="bdp-reviews">
                {allReviews.map(r=> <ReviewCard key={r.id} review={r}/>)}
              </div>
            ) : (
              <p className="bdp-reviews__empty">No reviews yet. Be the first!</p>
            )}
            <div className="bdp-add-review">
              <h3 className="bdp-add-review__title">Write a review</h3>
              <form onSubmit={submitReview} noValidate>
                <StarPicker value={reviewStars} onChange={setReviewStars} />
                <textarea
                  className="bdp-add-review__textarea field__input"
                  placeholder="What did you think of this book?"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={4}/>
                <label className="bdp-add-review__spoiler">
                  <input
                    type="checkbox"
                    checked={reviewSpoiler}
                    onChange={e => setReviewSpoiler(e.target.checked)}/>
                  This review contains spoilers
                </label>
                <button
                  type="submit"
                  className="btn btn--sage bdp-add-review__submit"
                  disabled={!reviewStars|| !reviewText.trim()}>
                  Post Review
                </button>
              </form>
            </div>
          </section>
        </motion.main>
      </div>
    </div>
  )
}