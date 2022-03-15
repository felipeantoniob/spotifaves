import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'

import ArtistModal from './ArtistModal'

const spotifyApi = new SpotifyWebApi()

const Artist = ({ ...artist }) => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [show, setShow] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<SpotifyApi.ArtistObjectFull>()
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const [relatedArtists, setRelatedArtists] = useState<SpotifyApi.ArtistObjectFull[]>()

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  const handleClick = async () => {
    // console.log('Artist props:')
    // console.log({ ...artist })
    setSelectedArtist({ ...(artist as SpotifyApi.ArtistObjectFull) })
    await getArtistTopTracks()
    await getArtistRelatedArtists()
    handleShow()
  }

  const getArtistTopTracks = async (): Promise<void> => {
    const country = 'US'

    try {
      const data = await spotifyApi.getArtistTopTracks(artist.id, country)
      console.log('Artist Top Tracks:')
      console.log(data.body.tracks)
      let topTracksArray = data.body.tracks
      setTopTracks(topTracksArray)
    } catch (err) {
      console.log(err)
    }
  }

  const getArtistRelatedArtists = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getArtistRelatedArtists(artist.id)
      console.log('Artist Related Artists:')
      console.log(data.body.artists)
      let relatedArtistsArray = data.body.artists
      setRelatedArtists(relatedArtistsArray)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
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
    }
  }, [session])

  return (
    <div className="mb-5">
      <Image
        src={artist.images[0].url}
        alt="profile picture"
        height={200}
        width={200}
        className="artist-profile-pic"
        onClick={handleClick}
      />
      <a
        href={artist.external_urls.spotify}
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
