import Image from 'next/image'
import { useState } from 'react'

import useArtistRelatedArtists from '../hooks/useArtistRelatedArtists'
import useArtistTopTracks from '../hooks/useArtistTopTracks'

import ArtistModal from './ArtistModal'

const Artist = ({ ...artist }: SpotifyApi.ArtistObjectFull): JSX.Element => {
  const [showModal, setShowModal] = useState(false)

  const handleCloseModal = (): void => setShowModal(false)
  const handleShowModal = (): void => setShowModal(true)

  const artistTopTracksQuery = useArtistTopTracks(artist, 'US')
  const artistRelatedArtistsQuery = useArtistRelatedArtists(artist.id)
  let artistTopTracks: SpotifyApi.TrackObjectFull[] = []
  let artistRelatedArtists: SpotifyApi.ArtistObjectFull[] = []

  if (artistTopTracksQuery.isSuccess) {
    artistTopTracks = artistTopTracksQuery.data.body.tracks
  }
  if (artistRelatedArtistsQuery.isSuccess) {
    artistRelatedArtists = artistRelatedArtistsQuery.data.body.artists
  }

  if (artistTopTracksQuery.isLoading || artistRelatedArtistsQuery.isLoading) {
    // return <div>Loading...</div>
  }

  const handleClick = async () => {
    await artistTopTracksQuery.refetch()
    await artistRelatedArtistsQuery.refetch()
    handleShowModal()
  }

  return (
    <div className="mb-5">
      <Image
        src={artist.images[0].url}
        alt="profile picture"
        draggable="false"
        height={200}
        width={200}
        className="img-artist-profile"
        onClick={handleClick}
      />
      <a
        href={artist.external_urls.spotify}
        target="_blank"
        rel="noreferrer"
        className="d-flex justify-content-center pt-3 text-decoration-none text-light"
      >
        {artist.name}
      </a>
      <ArtistModal
        handleClose={handleCloseModal}
        relatedArtists={artistRelatedArtists}
        selectedArtist={artist}
        show={showModal}
        topTracks={artistTopTracks}
      />
    </div>
  )
}

export default Artist
