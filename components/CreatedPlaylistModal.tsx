import { Button, Modal } from 'react-bootstrap'
import Image from 'next/image'

import { CreatedPlaylistModalProps } from '../types/index'

const CreatedPlaylistModal = ({
  show,
  handleClose,
  playlistDetails,
}: CreatedPlaylistModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="high-emphasis-text">
      <Modal.Header closeButton closeVariant="white" className="border-0"></Modal.Header>
      <Modal.Body className="text-center px-5">
        <h3 className="fw-bold">Success!</h3>
        <p className="fw-light">Your new Playlist is now available on Spotify.</p>
        <Image
          src={playlistDetails.images[0].url}
          alt="playlist cover"
          height={640}
          width={640}
          className="img-created-playlist mb-3"
        />
        <h5 className="fw-bold mb-4">{playlistDetails.name}</h5>
        <Button onClick={handleClose} className="btn-open-on-spotify fw-bold px-4 py-3 mb-3">
          <a
            href={playlistDetails.external_urls.spotify}
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none text-white"
          >
            Open on Spotify
          </a>
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default CreatedPlaylistModal
