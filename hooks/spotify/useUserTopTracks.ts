import { useQuery } from 'react-query'
import { TimeRangeType } from '../../components/TimeRangeRadio'
import { Response } from '../../types'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
const fetchUserTopTracks = async (
  timeRange: TimeRangeType,
  limit: number
): Promise<Response<SpotifyApi.UsersTopTracksResponse>> => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: limit })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useUserTopTracks(timeRange: TimeRangeType, limit: number) {
  return useQuery<Response<SpotifyApi.UsersTopTracksResponse>, Error>(
    ['userTopTracks', timeRange, limit],
    () => fetchUserTopTracks(timeRange, limit)
  )
}
