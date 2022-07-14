import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

/**
 * Get Spotify catalog information about an artist's top tracks by country
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks/
 */
export const getArtistTopTracks = async (artist: SpotifyApi.ArtistObjectFull, country: string) => {
  try {
    const spotifyApi = await initializeSpotifyApi()
    const data = await spotifyApi.getArtistTopTracks(artist.id, country)
    const artistTopTracks = data.body.tracks
    return artistTopTracks
  } catch (err) {
    console.log(err)
  }
}
