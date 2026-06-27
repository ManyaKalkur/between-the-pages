import './Pagination.css'

export default function Pagination({ current,total,onChange }) {
  if (total<= 1) return null
  const pages= []
  if (total<=7) {
    for (let i=1;i<=total;i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('…')
    const lo= Math.max(2,current-1)
    const hi= Math.min(total-1,current+1)
    for (let i=lo;i<=hi;i++) pages.push(i)
    if (current<total-2) pages.push('…')
    pages.push(total)
  }

  return (
    <nav className="pag" aria-label="Pagination">
      <button
        className="pag__btn pag__btn--arrow"
        onClick={()=> onChange(current-1)}
        disabled={current=== 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="pag__pages">
        {pages.map((p, i)=>
          p=== '…' ? (
            <span key={`e${i}`} className="pag__ellipsis">…</span>
          ):(
            <button
              key={p}
              className={`pag__btn ${current=== p? 'pag__btn--active': ''}`}
              onClick={()=> onChange(p)}
              aria-current={current=== p? 'page': undefined}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          )
        )}
      </div>
      <button
        className="pag__btn pag__btn--arrow"
        onClick={()=> onChange(current+1)}
        disabled={current=== total}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}