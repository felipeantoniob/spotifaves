import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Container, Row, Col } from 'react-bootstrap'

import TrackModal from './TrackModal'
import { msToMinutesAndSeconds } from '../utils'
import { getAudioFeaturesForTrack } from '../spotify'

import { MdInfo } from 'react-icons/md'

const Track = ({ ...track }): JSX.Element => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [show, setShow] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<SpotifyApi.TrackObjectFull>()
  const [audioFeatures, setAudioFeatures] = useState<SpotifyApi.AudioFeaturesObject>()

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  const handleClick = async () => {
    setSelectedTrack({ ...(track as SpotifyApi.TrackObjectFull) })
    const audioFeatures = await getAudioFeaturesForTrack(track.id)
    setAudioFeatures(audioFeatures)
    handleShow()
  }

  return (
    <>
      <Row
        key={track.id}
        className="mb-3 cursor-pointer justify-content-between hover-img"
        onClick={handleClick}
      >
        <Col xs="auto" className="my-auto position-relative left-0 top-0">
          <Image
            src={track.album.images[0].url}
            alt="album picture"
            height={50}
            width={50}
            layout="intrinsic"
            onClick={handleClick}
            // className="position-absolute left-0 top-0"
          />
          <div className="position-absolute top-50 start-50 translate-middle text-light info-icon">
            <MdInfo size="2rem" />
          </div>
        </Col>
        <Col>
          <div className="d-grid gap-2" style={{ gridTemplateColumns: '1fr max-content' }}>
            <div className="overflow-hidden">
              <span className="d-block overflow-hidden text-truncate text-nowrap high-emphasis-text">
                <span className="underline-hover-text">{track.name}</span>
              </span>
              <span className="d-block overflow-hidden text-truncate text-nowrap medium-emphasis-text fw-light">
                {track.artists
                  .map((artist: SpotifyApi.ArtistObjectSimplified) => {
                    return artist.name
                  })
                  .join(', ')}
                &nbsp;&nbsp;·&nbsp;&nbsp;
                {track.album.name}
              </span>
            </div>
            <span className="d-block text-decoration-none text-muted fw-light">
              {msToMinutesAndSeconds(track.duration_ms)}
            </span>
          </div>
        </Col>
      </Row>
      {selectedTrack && (
        <TrackModal
          audioFeatures={audioFeatures}
          handleClose={handleClose}
          selectedTrack={selectedTrack}
          show={show}
        />
      )}
    </>
  )
}

export default Track
