import { useMutation } from 'react-query'
import { initializeSpotifyApi } from '../../utils/initializeSpotifyApi'

interface addTracksToPlaylistProps {
  playlistId: string
  tracks: SpotifyApi.TrackObjectSimplified[] | SpotifyApi.TrackObjectFull[]
}

/**
 * Add one or more items to a user's playlist
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist/
 */
const addTracksToPlaylist = async ({ playlistId, tracks }: addTracksToPlaylistProps) => {
  const spotifyApi = await initializeSpotifyApi()
  await spotifyApi.addTracksToPlaylist(
    playlistId,
    tracks!.map((track) => track.uri)
  )
}

const useAddTracksToPlaylist = () => useMutation(addTracksToPlaylist)

export default useAddTracksToPlaylist
