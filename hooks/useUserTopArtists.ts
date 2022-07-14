import { useQuery } from 'react-query'
import { TimeRangeType } from '../types'
import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

/**
 * Get a User's Top Artists
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
const fetchUserTopArtists = async (timeRange: TimeRangeType, limit: number) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit: limit })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response

}

export default function useUserTopArtists(timeRange: TimeRangeType, limit: number) {
  return useQuery(['userTopArtists', timeRange, limit], () => fetchUserTopArtists(timeRange, limit))
}
