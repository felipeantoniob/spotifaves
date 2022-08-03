import { useQuery } from 'react-query'
import { Response } from '../../types'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'

/**
 * Get audio feature information for a single track identified by its unique Spotify ID
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features/
 */
const fetchAudioFeatures = async (
  trackId: string
): Promise<Response<SpotifyApi.AudioFeaturesResponse>> => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getAudioFeaturesForTrack(trackId)
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}
export default function useAudioFeatures(trackId: string) {
  return useQuery<Response<SpotifyApi.AudioFeaturesResponse>, Error>(
    ['audioFeatures', trackId],
    () => fetchAudioFeatures(trackId),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  )
}
