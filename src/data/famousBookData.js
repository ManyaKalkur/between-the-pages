export const FAMOUS_TITLES = new Set(['To Kill a Mockingbird'])
 
export const FAMOUS_BOOKS_DATA = { 
  'To Kill a Mockingbird': {
    spotifyPlaylistId: '37i9dQZF1DX4sWSpwq3LiO',
    pinterestUrl: 'https://www.pinterest.com/search/boards/?q=to+kill+a+mockingbird+harper+lee',
    quotes: [
      {
        text: 'You never really understand a person until you consider things from his point of view.',
        source: 'Harper Lee, To Kill a Mockingbird',
      },
      {
        text: 'Mockingbirds don\'t do one thing except make music for us to enjoy.',
        source: 'Harper Lee, To Kill a Mockingbird',
      },
    ],
    funFacts: [
      'Harper Lee only published two novels in her lifetime despite writing To Kill a Mockingbird in about two and a half years.',
      'The novel won the Pulitzer Prize in 1961, just one year after publication.',
      'Lee based Atticus Finch partly on her own father, a lawyer who defended two Black men accused of murder.',
    ],
    reviews: [
      {
        id: 1, name: 'James O.', initials: 'JO', stars: 5, spoiler: false,
        text: 'Required reading for every human being. Atticus Finch set the standard for moral courage in a way no character has matched since.',
        date: '6 days ago',
      },
    ],
  },
}

export function getFamousData(title) {
  if (!title) return null
  const direct= FAMOUS_BOOKS_DATA[title]
  if (direct) return direct
  const key= Object.keys(FAMOUS_BOOKS_DATA).find(k=>
    title.toLowerCase().includes(k.toLowerCase())||k.toLowerCase().includes(title.toLowerCase())
  )
  return key ? FAMOUS_BOOKS_DATA[key] : null
}