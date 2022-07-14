import { useQuery } from 'react-query'
import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

/**
 * Get a playlist owned by a Spotify user
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist/
 */
const fetchPlaylist = async (playlistId: string) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getPlaylist(playlistId)
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function usePlaylist(playlistId: string) {
  return useQuery(['playlist', playlistId], () => fetchPlaylist(playlistId), {
    refetchOnWindowFocus: false,
    // enabled: false, // disable this query from automatically running
    enabled: !!playlistId, // disable this query from automatically running
  })
}
