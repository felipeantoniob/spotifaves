import { getGenresArtists } from './getGenresArtists'

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
    const artistsArray = getGenresArtists(artists!, genre!)
    genresArtistsArray.push({ genre: genre, artists: artistsArray })
  })
  return genresArtistsArray
}
