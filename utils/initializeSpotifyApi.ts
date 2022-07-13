import { getSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'

const setCredentials = async (spotifyApi: SpotifyWebApi) => {
  const session = await getSession()
  try {
    if (session) {
      spotifyApi.setCredentials({
        accessToken: String(session!.accessToken),
        refreshToken: String(session!.refreshToken),
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const initializeSpotifyApi = async () => {
  const spotifyApi = new SpotifyWebApi()
  await setCredentials(spotifyApi)
  return spotifyApi
}
