import { useQuery } from 'react-query'

import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

/**
 * Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-related-artists/
 */
const fetchArtistRelatedArtists = async (artistId: string) => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getArtistRelatedArtists(artistId)

  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }

  return response
}

export default function useArtistRelatedArtists(artistId: string) {
  return useQuery(['artistRelatedArtists', artistId], () => fetchArtistRelatedArtists(artistId))
}
