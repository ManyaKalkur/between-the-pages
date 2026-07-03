export const EXPERIENCES= {
  default: {
    accent:'var(--gold)',
    scenes: [
      {
        type:'title',
        bg:'radial-gradient(ellipse at 50% 40%, #2E2029 0%, #14100F 100%)',
        accent:'#C4A882',
        headline:'{title}',
        subheadline:'by {author}',
        eyebrow:'A Cinematic Experience',
        decoration:'particles',
      },
      {
        type:'atmosphere',
        bg:'linear-gradient(160deg, #1A1119 0%, #2E2029 100%)',
        accent:'#7E6377',
        eyebrow:'Step inside the world',
        headline:'A story is waiting.',
        body:'{description}',
        decoration: 'particles',
      },
      {
        type:'quote',
        bg:'linear-gradient(180deg, #14100F 0%, #1A1119 100%)',
        accent:'#C4A882',
        quote: 'A reader lives a thousand lives before he dies.',
        attribution:'by George R.R. Martin',
        decoration:'none',
      },
      {
        type:'reveal',
        bg:'linear-gradient(180deg, #0A0808 0%, #14100F 100%)',
        accent:'#779273',
        headline:'Begin the journey',
        decoration:'particles',
      },
      {
        type:'end',
        bg:'linear-gradient(160deg, #14100F 0%, #2E2029 100%)',
        accent:'#C4A882',
        decoration:'particles',
      },
    ],
  },
}

export function findExperience(title= '', bookData= {}) {
  const lower= title.toLowerCase()
  return fillTemplate(EXPERIENCES.default, bookData)
}

function fillTemplate(exp, {title= '', author= '', description= '' }) {
  const short = description.length>220
    ?description.slice(0,220).trimEnd()+ '…'
    :description
  const replace= str=>
    str
      .replace('{title}',title)
      .replace('{author}',author)
      .replace('{description}', short||'A world awaits inside these pages.')
  return {
    ...exp,
    bookTitle:exp.bookTitle?? title,
    author:exp.author?? author,
    scenes:exp.scenes.map(scene=> ({
      ...scene,
      headline:scene.headline? replace(scene.headline):scene.headline,
      subheadline:scene.subheadline? replace(scene.subheadline):scene.subheadline,
      body:scene.body? replace(scene.body):scene.body,
      quote:scene.quote? replace(scene.quote):scene.quote,
    })),
  }
}