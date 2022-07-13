export const getAllGenres = (artists: SpotifyApi.ArtistObjectFull[]) => {
  let allGenresArray: string[] = []

  artists!
    .map((artist) => {
      allGenresArray = [...allGenresArray, ...artist.genres]
    })
    .sort()
  return allGenresArray
}
