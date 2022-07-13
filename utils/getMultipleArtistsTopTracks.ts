import { getArtistTopTracks } from './../spotify/index'

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
