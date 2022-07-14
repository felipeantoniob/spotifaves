import { useQuery } from 'react-query'
import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

/**
 * Get Spotify catalog information about an artist's top tracks by country
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks/
 */
const fetchArtistTopTracks = async (artist: SpotifyApi.ArtistObjectFull, country: string) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getArtistTopTracks(artist.id, country)
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}
export default function useArtistTopTracks(artist: SpotifyApi.ArtistObjectFull, country: string) {
  return useQuery(
    ['artistTopTracks', artist, country],
    () => fetchArtistTopTracks(artist, country),
    {
      refetchOnWindowFocus: false,
      enabled: false, // disable this query from automatically running
    }
  )
}
