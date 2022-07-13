export const getGenreFrequency = (genresArray: string[]) => {
  const genreFrequency: { [key: string]: number } = {}
  genresArray.map((genre) => {
    genreFrequency[genre] = (genreFrequency[genre] || 0) + 1
  })
  return genreFrequency
}
