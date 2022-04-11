import { Button, Col, Row } from 'react-bootstrap'
import { signIn } from 'next-auth/react'

const login = (): JSX.Element => {
  return (
    <main>
      <Row className="align-items-center vh-100 vw-100">
        <Col className="d-flex justify-content-center">
          <Button
            className="btn-login py-3 px-4"
            onClick={() => signIn('spotify', { callbackUrl: '/' })}
            data-cy="login-button"
          >
            LOG IN TO SPOTIFY
          </Button>
        </Col>
      </Row>
    </main>
  )
}

export default login
