export const shuffleTracks = (tracksArray: SpotifyApi.TrackObjectFull[]) => {
  return tracksArray.sort(() => Math.random() - 0.5)
}
