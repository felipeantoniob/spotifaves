export const msToMinutesAndSeconds = (ms: number) => {
  let minutes = Math.floor(ms / 60000)
  let seconds = parseInt(((ms % 60000) / 1000).toFixed(0))
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
