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
