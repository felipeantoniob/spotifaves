import Image from 'next/image'
import { Col, Row } from 'react-bootstrap'
import { MdInfo } from 'react-icons/md'

import useAudioFeatures from '../hooks/spotify/useAudioFeatures'
import useModal from '../hooks/useModal'

import { msToMinutesAndSeconds } from '../utils/msToMinutesAndSeconds'


import TrackModal from './TrackModal'

const Track = ({ ...track }: SpotifyApi.TrackObjectFull): JSX.Element => {
  const { isModalShowing, toggleModal } = useModal()

  const audioFeaturesQuery = useAudioFeatures(track.id)
  let audioFeatures: SpotifyApi.AudioFeaturesObject = {} as SpotifyApi.AudioFeaturesObject
  if (audioFeaturesQuery.isSuccess) {
    audioFeatures = audioFeaturesQuery.data.body
  }

  const handleClick = async () => {
    await audioFeaturesQuery.refetch()
    toggleModal()
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
      <TrackModal
        audioFeatures={audioFeatures}
        handleClose={toggleModal}
        track={track}
        isModalShowing={isModalShowing}
      />
    </>
  )
}

export default Track
