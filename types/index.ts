export type timeRangeType = 'long_term' | 'medium_term' | 'short_term'

export interface TimeRangeRadioProps {
  timeRange: timeRangeType
  setTimeRange: React.Dispatch<React.SetStateAction<timeRangeType>>
}

export interface ArtistModalProps {
  show: boolean
  handleClose: () => void
  selectedArtist: SpotifyApi.ArtistObjectFull | undefined
  relatedArtists: SpotifyApi.ArtistObjectFull[] | undefined
  topTracks: SpotifyApi.TrackObjectFull[] | undefined
}

export interface CreatedPlaylistModalProps {
  show: boolean
  handleClose: () => void
  playlistDetails: SpotifyApi.SinglePlaylistResponse
}

export interface TrackModalProps {
  show: boolean
  handleClose: () => void
  selectedTrack: SpotifyApi.TrackObjectFull | undefined
  audioFeatures: SpotifyApi.AudioFeaturesObject | undefined
}
