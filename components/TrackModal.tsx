import Image from 'next/image'
import { Button, Col, Modal, Row } from 'react-bootstrap'

import { TrackModalProps } from '../types/index'

const TrackModal = ({
  //   audioAnalysis,
  audioFeatures,
  handleClose,
  track,
  show,
}: TrackModalProps): JSX.Element => {
  if (audioFeatures) {
    const tempo = audioFeatures!.tempo
    const loudness = audioFeatures!.loudness
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton closeVariant="white" className="border-0"></Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col xs="auto">
            <Image
              src={track!.album.images[0].url}
              alt="profile picture"
              height={300}
              width={300}
            />
          </Col>
          <Col className="text-start">
            <div>
              <h1 className="display-5 fw-bold mb-3 high-emphasis-text">{track!.name}</h1>
              <h5 className="mb-3 medium-emphasis-text">
                {track!.artists
                  .map((artist: SpotifyApi.ArtistObjectSimplified) => {
                    return artist.name
                  })
                  .join(', ')}
              </h5>
              <h6 className="medium-emphasis-text mb-5">
                {track!.album.name}&nbsp;·&nbsp;
                {track!.album.release_date.substring(0, 4)}
              </h6>
              {/* {audioFeatures && <h5>{audioFeatures!.tempo.toFixed(2)} BPM</h5>} */}
              {/* {audioFeatures && <h5>{audioFeatures!.loudness.toFixed(2)} dB</h5>} */}
              <Button className="btn-play py-2 px-4">
                <a
                  href={track!.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-white"
                >
                  PLAY ON SPOTIFY
                </a>
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default TrackModal
