import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import ArtistModal from './ArtistModal'
import { getArtistTopTracks, getArtistRelatedArtists } from '../spotify'

const Artist = ({ ...artist }: SpotifyApi.ArtistObjectFull): JSX.Element => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [show, setShow] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<SpotifyApi.ArtistObjectFull>()
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const [relatedArtists, setRelatedArtists] = useState<SpotifyApi.ArtistObjectFull[]>()

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  const handleClick = async () => {
    setSelectedArtist({ ...(artist as SpotifyApi.ArtistObjectFull) })
    const artistTopTracks = await getArtistTopTracks(artist, 'US')
    setTopTracks(artistTopTracks)
    const artistRelatedArtists = await getArtistRelatedArtists(artist.id)
    setRelatedArtists(artistRelatedArtists)
    handleShow()
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
      {selectedArtist && (
        <ArtistModal
          handleClose={handleClose}
          relatedArtists={relatedArtists}
          selectedArtist={selectedArtist}
          show={show}
          topTracks={topTracks}
        />
      )}
    </div>
  )
}

export default Artist
