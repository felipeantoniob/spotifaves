export const msToMinutesAndSeconds = (ms: number) => {
  let minutes = Math.floor(ms / 60000)
  let seconds = parseInt(((ms % 60000) / 1000).toFixed(0))
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export const shuffleArray = (array: SpotifyApi.TrackObjectFull[]) => {
  return array.sort(() => Math.random() - 0.5)
}

export const timeRangeDescription = (timeRange: 'long_term' | 'medium_term' | 'short_term') => {
  if (timeRange === 'long_term') {
    return '(All Time)'
  }
  if (timeRange === 'medium_term') {
    return '(Last 6 Months)'
  }
  if (timeRange === 'short_term') {
    return '(Last Month)'
  }
}

export const getGenresArtistsArray = (artists: SpotifyApi.ArtistObjectFull[], genre: string) => {
  let artistArray: string[] = []
  artists!.map((artist) => {
    const artistIncludesGenre: boolean = artist.genres.includes(genre)

    if (artistIncludesGenre) {
      artistArray.push(artist.name)
    }
  })
  // console.log(artistArray)
  return artistArray
}

interface GenreObjectProps {
  genre: string
  artists: string[]
}

export const getGenreChartData = (
  genresArray: string[],
  artists: SpotifyApi.ArtistObjectFull[]
) => {
  let genresArtistsArray: GenreObjectProps[] = []

  genresArray.map((genre) => {
    const artistsArray = getGenresArtistsArray(artists!, genre!)
    genresArtistsArray.push({ genre: genre, artists: artistsArray })
  })
  console.log(genresArtistsArray)
  return genresArtistsArray
}

export const getGenreFrequency = (genresArray: string[]) => {
  const genreFrequency: { [key: string]: number } = {}
  genresArray.map((genre) => {
    genreFrequency[genre] = (genreFrequency[genre] || 0) + 1
  })
  // console.log(genreFrequency)
  return genreFrequency
}

export const getAllGenres = (artists: SpotifyApi.ArtistObjectFull[]) => {
  let allGenresArray: string[] = []

  artists!
    .map((artist) => {
      allGenresArray = [...allGenresArray, ...artist.genres]
    })
    .sort()
  return allGenresArray
}
