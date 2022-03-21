import { Button, Container, Row, Col } from 'react-bootstrap'

interface CreatePlaylistFooterProps {
  title: string
  description: string
  handleClick: () => Promise<void>
}

const CreatePlaylistFooter = ({ title, description, handleClick }: CreatePlaylistFooterProps) => {
  return (
    <Container>
      <Row className="d-flex justify-content-between align-items-center py-3 medium-emphasis-text">
        <Col>
          <div className="fw-bold mb-2 text-center text-md-start">{title}</div>
          <p className="fw-light text-center text-md-start">{description}</p>
        </Col>
        <Col xs={12} md="auto" className="d-flex justify-content-center">
          <Button className="btn-create-playlist px-4 py-2 fw-bold" onClick={handleClick}>
            Create Playlist
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default CreatePlaylistFooter
