import { useQuery } from 'react-query'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'

/**
 * Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks.
 * If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.
 * For artists and tracks that are very new or obscure there might not be enough data to generate a list of tracks.
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations/
 */
const fetchRecommendations = async (seedArtistsIds: string[]) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getRecommendations({
    seed_artists: seedArtistsIds,
    limit: 100,
  })
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useRecommendations(seedArtistsIds: string[]) {
  return useQuery('recommendations', () => fetchRecommendations(seedArtistsIds))
}
