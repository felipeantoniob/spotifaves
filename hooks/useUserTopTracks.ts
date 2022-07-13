import { useQuery } from 'react-query'

import { TimeRangeType } from '../types'
import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

interface TopTracksResponseObject {
  body: {
    href: string
    items: SpotifyApi.TrackObjectFull[]
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
  }
  headers: {
    'cache-control': string
    'content-length': string
    'content-type': string
  }

  statusCode: number
}

/**
 * Get a User's Top Tracks
 * https://developer.spotify.com/documentation/web-api/reference/personalization/get-users-top-artists-and-tracks/
 */
const fetchUserTopTracks = async (timeRange: TimeRangeType, limit: number) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: limit })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useUserTopTracks(timeRange: TimeRangeType, limit: number) {
  return useQuery(['userTopTracks', timeRange, limit], () => fetchUserTopTracks(timeRange, limit))
  // return useQuery<TopTracksResponseObject, Error>(['topTracks', timeRange, limit], () =>
  //   fetchTopTracks(timeRange, limit)
  // )
}
