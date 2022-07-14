import { useQuery } from 'react-query'
import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

/**
 * Get audio feature information for a single track identified by its unique Spotify ID
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features/
 */
const fetchAudioFeatures = async (trackId: string) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getAudioFeaturesForTrack(trackId)
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}
export default function useAudioFeatures(trackId: string) {
  return useQuery(['audioFeatures', trackId], () => fetchAudioFeatures(trackId), {
    refetchOnWindowFocus: false,
    enabled: false, // disable this query from automatically running
  })
}
