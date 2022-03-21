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

const Sidebar = () => {
  return (
    <Navbar >
      <div
        // className="d-flex flex-column flex-shrink-0 bg-secondary min-vh-100 fixed-top"
        className="d-flex flex-column flex-shrink-0 bg-secondary min-vh-100 position-fixed top-0 left-0"
        style={{ width: '100px' }}
      >
        <Navbar.Brand className="d-flex justify-content-center mx-0 py-4">
          <Link href="/" passHref>
            <a>
              <BsSpotify size="3rem" className="spotify-icon" />
            </a>
          </Link>
        </Navbar.Brand>
        <Nav variant="pills" className="flex-column mb-auto">
          <Link href="/" passHref>
            <Nav.Link className="py-3 px-0">
              <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center">
                <BsPersonFill size="1.5rem" />
                Profile
              </a>
            </Nav.Link>
          </Link>
          <Link href="/artists" passHref>
            <Nav.Link className="py-3 px-0">
              <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center">
                <GiMicrophone size="1.5rem" />
                Top Artists
              </a>
            </Nav.Link>
          </Link>
          <Link href="/tracks" passHref>
            <Nav.Link className="py-3 px-0">
              <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center">
                <BsMusicNoteBeamed size="1.5rem" />
                Top Tracks
              </a>
            </Nav.Link>
          </Link>
          <Link href="/recent" passHref>
            <Nav.Link className="py-3 px-0">
              <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center">
                <MdHistory size="1.5rem" />
                Recent
              </a>
            </Nav.Link>
          </Link>
          <Link href="/playlists" passHref>
            <Nav.Link className="py-3 px-0">
              <a className="nav-icon text-decoration-none fw-light d-flex flex-column align-items-center">
                <MdOutlineQueueMusic size="1.5rem" />
                Playlists
              </a>
            </Nav.Link>
          </Link>
        </Nav>
      </div>
    </Navbar>
  )
}

export default Sidebar
