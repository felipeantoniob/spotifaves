import { useQuery } from 'react-query'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'
import { Response } from '../../types'

/**
 * Get the current user's followed artists.
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-followed
 */
const fetchUserFollowedArtists = async (
  limit?: number
): Promise<Response<SpotifyApi.UsersFollowedArtistsResponse>> => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getFollowedArtists({ limit: limit })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useUserFollowedArtists(limit?: number) {
  return useQuery<Response<SpotifyApi.UsersFollowedArtistsResponse>, Error>(
    'userFollowedArtists',
    () => fetchUserFollowedArtists(limit)
  )
}
