import Link from 'next/link'
import Image from 'next/image'
import { Container, Navbar, Nav } from 'react-bootstrap'
import {
  BsPersonFill,
  BsMusicNoteBeamed,
  BsFillClockFill,
  BsMusicNoteList,
  BsSpotify,
} from 'react-icons/bs'
import { GiMicrophone } from 'react-icons/gi'

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
        <Container fluid>
          <Navbar.Brand className="px-3">
            <Link href="/" passHref>
              <a>
                <BsSpotify size="3rem" className="spotify-icon" />
              </a>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center fs-5">
              <Nav.Link className="px-3 g-5">
                <Link href="/" passHref>
                  <a className="text-decoration-none link-light d-flex flex-column align-items-center px-2">
                    <BsPersonFill size="2rem" />
                    Profile
                  </a>
                </Link>
              </Nav.Link>
              <Nav.Link className="px-3 g-5">
                <Link href="/artists" passHref>
                  <a className="text-decoration-none link-light d-flex flex-column align-items-center px-2">
                    <GiMicrophone size="2rem" />
                    Top Artists
                  </a>
                </Link>
              </Nav.Link>
              <Nav.Link className="px-3 g-5">
                <Link href="/tracks" passHref>
                  <a className="text-decoration-none link-light d-flex flex-column align-items-center px-2">
                    <BsMusicNoteBeamed size="2rem" />
                    Top Tracks
                  </a>
                </Link>
              </Nav.Link>

              <Nav.Link className="px-3 g-5">
                <Link href="/recent" passHref>
                  <a className="text-decoration-none link-light d-flex flex-column align-items-center px-2">
                    <BsFillClockFill size="2rem" />
                    Recent
                  </a>
                </Link>
              </Nav.Link>
              <Nav.Link className="px-3 g-5">
                <Link href="/playlists" passHref>
                  <a className="text-decoration-none link-light d-flex flex-column align-items-center px-2">
                    <BsMusicNoteList size="2rem" />
                    Playlists
                  </a>
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
