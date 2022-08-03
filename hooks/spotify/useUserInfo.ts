import { useQuery } from 'react-query'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'
import { Response } from '../../types'

/**
 * Get detailed profile information about the current user (including the current user's username)
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-current-users-profile/
 */
const fetchUserInfo = async (): Promise<Response<SpotifyApi.CurrentUsersProfileResponse>> => {
  const spotifyApi = await initializeSpotifyApi()
  const response = await spotifyApi.getMe()
  if (response.statusCode !== 200) {
    throw new Error('Network response was not ok')
  }
  return response
}

export default function useUserInfo() {
  return useQuery<Response<SpotifyApi.CurrentUsersProfileResponse>, Error>('userInfo', () =>
    fetchUserInfo()
  )
}
