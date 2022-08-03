import Link from 'next/link'
import { Container, Nav, Navbar } from 'react-bootstrap'
import {
  BsMusicNoteBeamed,
  BsPersonFill,
  BsFillClockFill,
  BsMusicNoteList,
  BsSpotify,
} from 'react-icons/bs'
import { MdHistory } from 'react-icons/md'
import { MdOutlineQueueMusic } from 'react-icons/md'
import { FiPieChart } from 'react-icons/fi'
import { GiMicrophone } from 'react-icons/gi'

const Header = (): JSX.Element => {
  return (
    <header>
      <Navbar expand="lg" variant="dark" className="py-3">
        <Container fluid>
          <Navbar.Brand className="px-3">
            <Link href="/profile" passHref>
              <a>
                <BsSpotify size="48px" className="spotify-icon" />
              </a>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="nav-link-container">
            <Nav className="ms-auto align-items-center fs-5">
              <Link href="/profile" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <BsPersonFill size="24px" />
                    Profile
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/artists" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <GiMicrophone size="24px" />
                    Top Artists
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/tracks" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <BsMusicNoteBeamed size="24px" />
                    Top Tracks
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/genres" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <FiPieChart size="24px" />
                    Top Genres
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/recent" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <MdHistory size="24px" />
                    Recent
                  </a>
                </Nav.Link>
              </Link>
              {/* <Link href="/playlists" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <MdOutlineQueueMusic size="24px" />
                    Playlists
                  </a>
                </Nav.Link>
              </Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
