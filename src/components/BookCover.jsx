import './BookCover.css'

export default function BookCover({ opening }) {
  return (
    <div className={`bc ${opening ? 'bc--opening' :''}`} aria-hidden="true">
      <div className="bc__pages-edge" />
      <div className="bc__spine" />
      <div className="bc__glow bc__glow--center"/>
      <div className="bc__glow bc__glow--top"/>
      <span className="bc__corner bc__corner--tl"/>
      <span className="bc__corner bc__corner--tr"/>
      <span className="bc__corner bc__corner--bl"/>
      <span className="bc__corner bc__corner--br"/>
      <div className="bc__frame" />
      <div className="bc__content">
        <div className="bc__ornament bc__ornament--top">
          <span className="bc__orn-line" />
          <span className="bc__orn-diamond">◆</span>
          <span className="bc__orn-line" />
        </div>
        <p className="bc__pre-title">A Reader's Universe</p>
        <h1 className="bc__title">
          <span className="bc__title-between">Between</span>
          <span className="bc__title-the">the</span>
          <span className="bc__title-pages">Pages</span>
        </h1>
        <div className="bc__ornament bc__ornament--mid">
          <span className="bc__orn-line" />
          <span className="bc__orn-text">✦</span>
          <span className="bc__orn-line" />
        </div>
        <p className="bc__tagline">
          Every book is a world.<br />Step inside.
        </p>
        <div className="bc__open-cue">
          <span className="bc__open-dot" />
          <span className="bc__open-label">Opening…</span>
        </div>
      </div>
      <div className="bc__foot-ornament">
        <span className="bc__orn-line" />
        <span className="bc__orn-text">Between the Pages</span>
        <span className="bc__orn-line" />
      </div>
    </div>
  )
}
