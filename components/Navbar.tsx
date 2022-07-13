import Link from 'next/link'
import { Container, Navbar, Nav } from 'react-bootstrap'
import {
  BsPersonFill,
  BsMusicNoteBeamed,
  BsFillClockFill,
  BsMusicNoteList,
  BsSpotify,
} from 'react-icons/bs'
import { MdHistory, MdOutlineQueueMusic } from 'react-icons/md'
import { GiMicrophone } from 'react-icons/gi'
import { FiPieChart } from 'react-icons/fi'

const Header = (): JSX.Element => {
  return (
    <header>
      <Navbar expand="lg" variant="dark" className="py-3">
        <Container fluid>
          <Navbar.Brand className="px-3">
            <Link href="/profile" passHref>
              <a>
                <BsSpotify size="3rem" className="spotify-icon" />
              </a>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="nav-link-container">
            <Nav className="ms-auto align-items-center fs-5">
              <Link href="/profile" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <BsPersonFill size="1.5rem" />
                    Profile
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/artists" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <GiMicrophone size="1.5rem" />
                    Top Artists
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/tracks" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <BsMusicNoteBeamed size="1.5rem" />
                    Top Tracks
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/genres" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <FiPieChart size="1.5rem" />
                    Top Genres
                  </a>
                </Nav.Link>
              </Link>
              <Link href="/recent" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <MdHistory size="1.5rem" />
                    Recent
                  </a>
                </Nav.Link>
              </Link>
              {/* <Link href="/playlists" passHref>
                <Nav.Link className="px-3 g-5">
                  <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center px-2">
                    <MdOutlineQueueMusic size="1.5rem" />
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
