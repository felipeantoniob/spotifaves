import Image from 'next/image'
import { Card, Col, Modal, Row, Button } from 'react-bootstrap'

interface TrackModalProps {
  show: boolean
  handleClose: () => void
  selectedTrack: SpotifyApi.TrackObjectFull | undefined
  audioFeatures: SpotifyApi.AudioFeaturesObject | undefined
}

const TrackModal = ({
  //   audioAnalysis,
  audioFeatures,
  handleClose,
  selectedTrack,
  show,
}: TrackModalProps): JSX.Element => {
  if (audioFeatures) {
    let tempo = audioFeatures!.tempo
    let loudness = audioFeatures!.loudness
    // console.log(tempo)
    // console.log(loudness)
  }

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton closeVariant="white" className="border-0"></Modal.Header>
      <Modal.Body className="text-center">
        <Row>
          <Col xs="auto">
            <Image
              src={selectedTrack!.album.images[0].url}
              alt="profile picture"
              height={300}
              width={300}
            />
          </Col>
          <Col className="text-start">
            <div>
              <h1 className="display-5 fw-bold mb-3 high-emphasis-text">{selectedTrack!.name}</h1>
              <h5 className="mb-3 medium-emphasis-text">
                {selectedTrack!.artists
                  .map((artist: SpotifyApi.ArtistObjectSimplified) => {
                    return artist.name
                  })
                  .join(', ')}
              </h5>
              <h6 className="medium-emphasis-text mb-5">
                {selectedTrack!.album.name}&nbsp;·&nbsp;
                {selectedTrack!.album.release_date.substring(0, 4)}
              </h6>
              {/* {audioFeatures && <h5>{audioFeatures!.tempo.toFixed(2)} BPM</h5>} */}
              {/* {audioFeatures && <h5>{audioFeatures!.loudness.toFixed(2)} dB</h5>} */}
              <Button className="play-btn py-2 px-4">
                <a
                  href={selectedTrack!.external_urls.spotify}
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
