import dayjs from 'dayjs'
import { useMutation } from 'react-query'
import { initializeSpotifyApi } from '../utils/initializeSpotifyApi'

const createPlaylist = async (playlistName: string) => {
  const spotifyApi = await initializeSpotifyApi()
  const data = await spotifyApi.createPlaylist(
    `${playlistName} • ${dayjs().format('YYYY MMMM DD')}`,
    {
      description: `Playlist created on ${dayjs().format('MMMM D, YYYY h:mm A')}`,
      public: false,
    }
  )
  const playlistId = data.body.id
  return playlistId
}

/**
 * Create a playlist for a Spotify user (The playlist will be empty until you add tracks)
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist/
 */
const useCreatePlaylist = () => useMutation(createPlaylist)

export default useCreatePlaylist
