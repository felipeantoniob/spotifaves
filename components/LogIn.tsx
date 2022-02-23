import { Button, Row, Col } from 'react-bootstrap'
import { signIn } from 'next-auth/react'

const LogIn = (): JSX.Element => {
  return (
    <div>
      <Row>
        <Col className="d-flex justify-content-center">
          <Button className="log-in-btn py-3 px-3" onClick={() => signIn('spotify')}>
            LOG IN TO SPOTIFY
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default LogIn
