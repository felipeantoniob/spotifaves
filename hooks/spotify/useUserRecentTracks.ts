import { useQuery } from 'react-query'
import { Response } from '../../types'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'

/**
 * Get Current User's Recently Played Tracks
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/
 */
const fetchUserRecentTracks = async (
  limit: number
): Promise<Response<SpotifyApi.UsersRecentlyPlayedTracksResponse>> => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getMyRecentlyPlayedTracks({
    limit: limit,
  })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useUserRecentTracks(limit: number) {
  return useQuery<Response<SpotifyApi.UsersRecentlyPlayedTracksResponse>, Error>(
    ['userRecentTracks', limit],
    () => fetchUserRecentTracks(limit)
  )
}
