import { useState, useEffect, useRef } from 'react'
import './FilterBar.css'

const GENRES= [
  'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction',
  'Fantasy', 'Romance', 'Biography', 'History',
  'Science', 'Horror', 'Thriller', 'Children',
]
const RATINGS= [
  { value:'4',label:'4+ Stars'},
  { value:'3',label:'3+ Stars'},
  { value:'2', label:'2+ Stars'},
]
const LANGUAGES= [
  { code:'en',label:'English'},
  { code:'es',label:'Spanish'},
  { code:'fr',label:'French'},
  { code:'de',label:'German'},
  { code:'it',label:'Italian'},
  { code:'pt',label:'Portuguese'},
  { code:'ja',label:'Japanese'},
  { code:'zh',label:'Chinese'},
]
const THIS_YEAR= new Date().getFullYear()
const YEARS= Array.from({length:26}, (_, i)=> String(THIS_YEAR-i))

function Dropdown({ id,label,value,options,valueKey,labelKey,open,onToggle,onSelect }) {
  const ref= useRef(null)
  useEffect(()=> {
    if (!open) return
    const handler= e=> {if (ref.current && !ref.current.contains(e.target)) onToggle(null)}
    document.addEventListener('mousedown', handler)
    return ()=> document.removeEventListener('mousedown', handler)
  }, [open, onToggle])
  const getLabel= v=> {
    if (!v) return label
    if (!valueKey) return v
    return options.find(o=> o[valueKey]=== v)?.[labelKey]?? v
  }

  return (
    <div className={`fb__dd ${open? 'fb__dd--open':''}`} ref={ref}>
      <button
        className={`fb__dd-btn ${value? 'fb__dd-btn--active': ''}`}
        onClick={()=> onToggle(open? null: id)}
        type="button"
      >
        {getLabel(value)}
        <svg className="fb__dd-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div className="fb__menu" role="listbox">
          <button
            className="fb__menu-item"
            role="option"
            onClick={()=> onSelect('')}
            type="button">
            Any
          </button>
          {options.map(opt=> {
            const v= valueKey? opt[valueKey]: opt
            const l= labelKey ? opt[labelKey]: opt
            return (
              <button
                key={v}
                className={`fb__menu-item ${value=== v? 'fb__menu-item--on':''}`}
                role="option"
                aria-selected={value=== v}
                onClick={()=> onSelect(v)}
                type="button">
                {l}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="6.5" height="6.5" rx="1"/>
      <rect x="8.5" y="0" width="6.5" height="6.5" rx="1"/>
      <rect x="0" y="8.5" width="6.5" height="6.5" rx="1"/>
      <rect x="8.5" y="8.5" width="6.5" height="6.5" rx="1"/>
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0.5" width="15" height="2.5" rx="1"/>
      <rect x="0" y="6" width="15" height="2.5" rx="1"/>
      <rect x="0" y="11.5" width="15" height="2.5" rx="1"/>
    </svg>
  )
}

export default function FilterBar({ filters, onChange, view, onViewChange, total, loading }) {
  const [openId, setOpenId]= useState(null)
  const update= (key, value)=> {
    onChange({ ...filters, [key]: value})
    setOpenId(null)
  }
  const activeCount= [
    filters.genre,
    filters.rating,
    filters.year,
    filters.language,
    filters.famousOnly? 'x': '',
  ].filter(Boolean).length
  const clearAll= ()=> {
    onChange({ genre: '', rating: '', year: '', language: '', famousOnly: false})
    setOpenId(null)
  }

  return (
    <div className="fb">
      <div className="fb__inner">
        <div className="fb__left">
          <span className="fb__count">
            {loading? 'Searching…': `${total.toLocaleString()} books`}
          </span>
          <div className="fb__filters">
            <Dropdown
              id="genre" label="Genre" value={filters.genre}
              options={GENRES}
              open={openId=== 'genre'}
              onToggle={setOpenId}
              onSelect={v=> update('genre', v)}
            />
            <Dropdown
              id="rating" label="Rating" value={filters.rating}
              options={RATINGS} valueKey="value" labelKey="label"
              open={openId=== 'rating'}
              onToggle={setOpenId}
              onSelect={v=> update('rating', v)}
            />
            <Dropdown
              id="year" label="Year" value={filters.year}
              options={YEARS}
              open={openId=== 'year'}
              onToggle={setOpenId}
              onSelect={v=> update('year', v)}
            />
            <Dropdown
              id="language" label="Language" value={filters.language}
              options={LANGUAGES} valueKey="code" labelKey="label"
              open={openId=== 'language'}
              onToggle={setOpenId}
              onSelect={v=> update('language',v)}
            />
            <button
              type="button"
              className={`fb__famous ${filters.famousOnly? 'fb__famous--on': ''}`}
              onClick={()=> update('famousOnly', !filters.famousOnly)}
            >
              <span aria-hidden="true">♛</span>
              Experiences only
            </button>
            {activeCount>0 && (
              <button type="button" className="fb__clear" onClick={clearAll}>
                Clear {activeCount>1? `(${activeCount})`:''}
              </button>
            )}
          </div>
        </div>
        <div className="fb__view">
          <button
            type="button"
            className={`fb__view-btn ${view=== 'grid'? 'fb__view-btn--on':''}`}
            onClick={()=> onViewChange('grid')}
            aria-label="Grid view"
          >
            <GridIcon/>
          </button>
          <button
            type="button"
            className={`fb__view-btn ${view=== 'list' ? 'fb__view-btn--on':''}`}
            onClick={()=> onViewChange('list')}
            aria-label="List view"
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
