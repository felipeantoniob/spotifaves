import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import SpotifyWebApi from 'spotify-web-api-node'

import TrackModal from './TrackModal'
import { msToMinutesAndSeconds } from '../utils'

const spotifyApi = new SpotifyWebApi()

const Track = ({ ...track }) => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [show, setShow] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<SpotifyApi.TrackObjectFull>()
  const [audioFeatures, setAudioFeatures] = useState<SpotifyApi.AudioFeaturesObject>()

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  const handleClick = async () => {
    // console.log('Track props:')
    // console.log({ ...track })
    setSelectedTrack({ ...(track as SpotifyApi.TrackObjectFull) })
    await getAudioFeaturesForTrack()
    handleShow()
  }

  const getAudioFeaturesForTrack = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getAudioFeaturesForTrack(track.id)
      let audioFeatures = data.body
      console.log(audioFeatures)
      setAudioFeatures(audioFeatures)
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
    <div>
      <div key={track.id} className="mb-4 d-flex cursor-pointer" onClick={handleClick}>
        <Image
          src={track.album.images[0].url}
          alt="album picture"
          height={50}
          width={50}
          onClick={handleClick}
        />
        <div className="d-flex flex-column justify-content-center text-decoration-none text-light text-start ps-3">
          <div className="high-emphasis-text">{track.name}</div>
          <div className="medium-emphasis-text">
            {track.artists
              .map((artist: SpotifyApi.ArtistObjectSimplified) => {
                return artist.name
              })
              .join(', ')}
            &nbsp;&nbsp;·&nbsp;&nbsp;
            {track.album.name}
          </div>
        </div>
        <div className="d-flex justify-content-center text-decoration-none text-muted ms-auto">
          {msToMinutesAndSeconds(track.duration_ms)}
        </div>
      </div>
      {selectedTrack && (
        <TrackModal
          audioFeatures={audioFeatures}
          handleClose={handleClose}
          selectedTrack={selectedTrack}
          show={show}
        />
      )}
    </div>
  )
}

export default Track
