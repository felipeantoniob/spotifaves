import { Col, Spinner as BootstrapSpinner } from 'react-bootstrap'

const Spinner = () => {
  return (
    <Col className="d-flex justify-content-center align-items-center my-5 py-5">
      <BootstrapSpinner animation="border" variant="light" role="status">
        <span className="visually-hidden">Loading...</span>
      </BootstrapSpinner>
    </Col>
  )
}

export default Spinner
