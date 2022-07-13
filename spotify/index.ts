import dayjs from 'dayjs'
import { getSession, signIn } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'

const spotifyApi = new SpotifyWebApi()

export const initializeSpotifyApi = async () => {
  const session = await getSession()
  if (session) {
    const setCredentials = (): void => {
      try {
        spotifyApi.setCredentials({
          accessToken: String(session.accessToken),
          refreshToken: String(session.refreshToken),
        })
      } catch (err) {
        console.log(err)
      }
    }
    setCredentials()
  } else {
    // signIn('spotify')
  }
}

/**
 * Create a playlist for a Spotify user (The playlist will be empty until you add tracks)
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist/
 */
export const createNewPlaylist = async (playlistName: string) => {
  try {
    const data = await spotifyApi.createPlaylist(
      `${playlistName} • ${dayjs().format('YYYY MMMM DD')}`,
      {
        description: `Playlist created on ${dayjs().format('MMMM D, YYYY h:mm A')}`,
        public: false,
      }
    )
    const playlistId = data.body.id
    return playlistId
  } catch (err) {
    console.log(err)
  }
}

/**
 * Add one or more items to a user's playlist
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist/
 */
export const addTracksToPlaylist = async (
  playlistId: string,
  tracks: SpotifyApi.TrackObjectSimplified[] | SpotifyApi.TrackObjectFull[]
) => {
  try {
    await spotifyApi.addTracksToPlaylist(
      playlistId,
      tracks!.map((track) => track.uri)
    )
  } catch (err) {
    console.log(err)
  }
}

/**
 * Get a playlist owned by a Spotify user
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-playlist/
 */
export const getPlaylistDetails = async (playlistId: string) => {
  try {
    const data = await spotifyApi.getPlaylist(playlistId)
    const playlistDetails = data.body
    return playlistDetails
  } catch (err) {
    console.log(err)
  }
}

/**
 * Get Spotify catalog information about an artist's top tracks by country
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-top-tracks/
 */
export const getArtistTopTracks = async (artist: SpotifyApi.ArtistObjectFull, country: string) => {
  try {
    initializeSpotifyApi()
    const data = await spotifyApi.getArtistTopTracks(artist.id, country)
    const artistTopTracks = data.body.tracks
    return artistTopTracks
  } catch (err) {
    console.log(err)
  }
}

/**
 * Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-an-artists-related-artists/
 */
export const getArtistRelatedArtists = async (artistId: string) => {
  try {
    const data = await spotifyApi.getArtistRelatedArtists(artistId)
    const relatedArtists = data.body.artists
    return relatedArtists
  } catch (err) {
    console.log(err)
  }
}

/**
 * Get audio feature information for a single track identified by its unique Spotify ID
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features/
 */
export const getAudioFeaturesForTrack = async (trackId: string) => {
  try {
    const data = await spotifyApi.getAudioFeaturesForTrack(trackId)
    const audioFeatures = data.body
    return audioFeatures
  } catch (err) {
    console.log(err)
  }
}

export const getMultipleArtistsTopTracks = async (
  artists: SpotifyApi.ArtistObjectFull[],
  artistsLimit: number,
  tracksLimit: number
) => {
  try {
    const filteredArtists = artists!.slice(0, artistsLimit)

    let topArtistTopTracks: SpotifyApi.TrackObjectFull[] = []

    for (const artist of filteredArtists) {
      const topTracks = (await getArtistTopTracks(artist, 'US')) as SpotifyApi.TrackObjectFull[]
      const filteredTracks = topTracks.slice(0, tracksLimit)
      topArtistTopTracks = [...topArtistTopTracks, ...filteredTracks]
    }

    return topArtistTopTracks
  } catch (err) {
    console.log(err)
  }
}

/**
 * Recommendations are generated based on the available information for a given seed entity and matched against similar artists and tracks.
 * If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details.
 * For artists and tracks that are very new or obscure there might not be enough data to generate a list of tracks.
 * https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations/
 */
export const getRecommendations = async (seedArtistsIds: string[]) => {
  try {
    const data = await spotifyApi.getRecommendations({
      seed_artists: seedArtistsIds,
      limit: 100,
    })
    const recommendations = data.body
    return recommendations
  } catch (err) {
    console.log(err)
  }
}
