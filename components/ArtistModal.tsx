import Image from 'next/image'
import { Col, Modal, Row } from 'react-bootstrap'


type ArtistModalProps = {
  isModalShowing: boolean
  handleClose: () => void
  selectedArtist: SpotifyApi.ArtistObjectFull | undefined
  relatedArtists: SpotifyApi.ArtistObjectFull[] | undefined
  topTracks: SpotifyApi.TrackObjectFull[] | undefined
}

const ArtistModal = ({
  handleClose,
  relatedArtists,
  selectedArtist,
  isModalShowing,
  topTracks,
}: ArtistModalProps): JSX.Element => {
  return (
    <Modal show={isModalShowing} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton closeVariant="white" className="border-0"></Modal.Header>
      <Modal.Body className="text-center">
        <Image
          src={selectedArtist!.images[0].url}
          alt="profile picture"
          draggable="false"
          height={300}
          width={300}
          className="img-artist-modal"
        />
        <h1 className="display-3 fw-bold my-5 high-emphasis-text">{selectedArtist!.name}</h1>
        <Row className="justify-content-center">
          <Col xs="auto" className="mb-5">
            <div>
              <div
                className="medium-emphasis-text fs-6 fw-light medium-emphasis-text"
                style={{ letterSpacing: '1px' }}
              >
                Genres
              </div>
              <div>
                {selectedArtist!.genres.map((genre, index) => (
                  <div key={index} className="text-capitalize text-blue fw-bold">
                    {genre}
                  </div>
                ))}
              </div>
            </div>
          </Col>
          {topTracks && (
            <Col xs="auto" className="mb-5">
              <div className="medium-emphasis-text fs-6 fw-light" style={{ letterSpacing: '1px' }}>
                Top Tracks
              </div>
              <div>
                {topTracks!.map((track, index) => (
                  <div key={index}>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="text-capitalize text-blue text-decoration-none fw-bold"
                    >
                      {track.name}
                    </a>
                  </div>
                ))}
              </div>
            </Col>
          )}
          {relatedArtists && (
            <Col xs="auto" className="mb-5">
              <div className="medium-emphasis-text fs-6 fw-light" style={{ letterSpacing: '1px' }}>
                Related Artists
              </div>
              <div>
                {relatedArtists!
                  .filter((item, index) => index < 10)
                  .map((artist, index) => (
                    <div key={index}>
                      <a
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noreferrer"
                        className="text-capitalize text-blue text-decoration-none fw-bold"
                      >
                        {artist.name}
                      </a>
                    </div>
                  ))}
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default ArtistModal
