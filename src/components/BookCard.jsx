import { Link } from 'react-router-dom'
import './BookCard.css'

function Stars({rating}) {
  if (!rating) return null
  const full= Math.round(rating)
  return (
    <div className="bcard__stars" aria-label={`${rating} out of 5`}>
      {Array.from({length:5}).map((_, i)=> (
        <span key={i} className={i<full?'bcard__star bcard__star--on':'bcard__star'}>
          ★
        </span>
      ))}
      <span className="bcard__rating-num">{rating.toFixed(1)}</span>
    </div>
  )
}

function CoverFallback({title}) {
  const letters=title
    .split(' ')
    .slice(0,2)
    .map(w=>w[0]?.toUpperCase()??'')
    .join('')
  return (
    <div className="bcard__fallback" aria-hidden="true">
      <span>{letters}</span>
    </div>
  )
}

function FamousCard({book}) {
  const { id,title,author,cover,rating,genre }= book
  return (
    <Link to={`/books/${id}`} className="bcard bcard--famous">
      {cover
        ? <img src={cover} alt="" className="bcard__famous-bg" loading="lazy"/>
        : <div className="bcard__famous-bg bcard__famous-bg--empty"/>
      }
      <div className="bcard__famous-overlay"/>
      <div className="bcard__crown">
        <span aria-hidden="true">♛</span> Experience
      </div>
      <div className="bcard__famous-body">
        {genre && <span className="bcard__genre">{genre}</span>}
        <h3 className="bcard__famous-title">{title}</h3>
        <p className="bcard__famous-author">{author}</p>
        <Stars rating={rating}/>
      </div>
      <div className="bcard__famous-cta" aria-hidden="true">
        Enter Experience
      </div>
    </Link>
  )
}

function GridCard({ book }) {
  const { id,title,author,cover,rating,genre }=book
  return (
    <Link to={`/books/${id}`} className="bcard bcard--grid">
      <div className="bcard__cover">
        {cover
          ? <img src={cover} alt={title} loading="lazy"/>
          : <CoverFallback title={title}/>
        }
        {genre && <span className="bcard__genre bcard__genre--cover">{genre}</span>}
      </div>
      <div className="bcard__info">
        <h3 className="bcard__title">{title}</h3>
        <p className="bcard__author">{author}</p>
        <Stars rating={rating}/>
      </div>
    </Link>
  )
}
function ListCard({ book }) {
  const { id,title,author,cover,rating,genre,year,isFamous }=book
  return (
    <Link to={`/books/${id}`} className="bcard bcard--list">
      <div className="bcard__list-thumb">
        {cover
          ?<img src={cover} alt={title} loading="lazy"/>
          :<CoverFallback title={title}/>
        }
      </div>
      <div className="bcard__list-details">
        <div className="bcard__list-top">
          <h3 className="bcard__list-title">{title}</h3>
          {isFamous && (
            <span className="bcard__crown bcard__crown--sm" aria-label="Has cinematic experience">
              ♛
            </span>
          )}
        </div>
        <p className="bcard__list-author">{author}</p>
        <div className="bcard__list-meta">
          {genre &&<span className="bcard__genre">{genre}</span>}
          {year &&<span className="bcard__year">{year}</span>}
        </div>
        <Stars rating={rating}/>
      </div>
      <span className="bcard__list-arrow" aria-hidden="true">→</span>
    </Link>
  )
}
export default function BookCard({ book, view='grid' }) {
  if (view=== 'list') return <ListCard book={book}/>
  if (book.isFamous)  return <FamousCard book={book}/>
  return <GridCard book={book}/>
}
