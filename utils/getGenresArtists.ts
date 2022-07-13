export const getGenresArtists = (artists: SpotifyApi.ArtistObjectFull[], genre: string) => {
  let artistArray: string[] = []
  artists!.map((artist) => {
    const artistIncludesGenre: boolean = artist.genres.includes(genre)

    if (artistIncludesGenre) {
      artistArray.push(artist.name)
    }
  })
  return artistArray
}
