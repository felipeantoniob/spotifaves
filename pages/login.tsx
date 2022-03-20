import { Button, Row, Col } from 'react-bootstrap'
import { signIn } from 'next-auth/react'

const login = (): JSX.Element => {
  return (
    <div>
      <Row className="align-items-center g-5 py-5 min-vh-100">
        <Col className="d-flex justify-content-center">
          <Button
            className="btn-login py-3 px-4"
            onClick={() => signIn('spotify', { callbackUrl: '/' })}
          >
            LOG IN TO SPOTIFY
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default login
