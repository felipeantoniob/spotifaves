import { useQuery } from 'react-query'
import { Response } from '../../types'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'

/**
 * Get a List of Current User's Playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-a-list-of-current-users-playlists/
 */
const fetchUserPlaylists = async (
  limit?: number
): Promise<Response<SpotifyApi.ListOfUsersPlaylistsResponse>> => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getUserPlaylists({ limit: limit })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useUserPlaylists(limit?: number) {
  return useQuery<Response<SpotifyApi.ListOfUsersPlaylistsResponse>, Error>('userPlaylists', () =>
    fetchUserPlaylists(limit)
  )
}
