import Image from 'next/image'
import { Button, Container, Row, Modal } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Track from '../components/Track'
import {
  addTracksToPlaylist,
  createNewPlaylist,
  getPlaylistDetails,
  getRecentlyPlayedTracks,
} from '../spotify'

const Recent = (): JSX.Element => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })

  const { data: session } = useSession()
  const [show, setShow] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  const [recentTracks, setRecentTracks] = useState<SpotifyApi.TrackObjectSimplified[]>()
  const [playlistDetails, setPlaylistDetails] = useState<SpotifyApi.SinglePlaylistResponse>()

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        setShowFooter(true)
      } else {
        setShowFooter(false)
      }
    })
  }, [])

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const recentTracks = await getRecentlyPlayedTracks()
          setRecentTracks(recentTracks)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [session])

  const handleClick = async () => {
    try {
      const playlistId = await createNewPlaylist('Recently Played Tracks')
      await addTracksToPlaylist(playlistId!, recentTracks!)
      const playlistDetails = await getPlaylistDetails(playlistId!)
      setPlaylistDetails(playlistDetails)

      handleShow()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {recentTracks && (
        <>
          <Container className="pt-5">
            <div className="d-flex align-items-center pb-5">
              <h2 className="fw-bold high-emphasis-text">Recent Tracks</h2>
            </div>
            <Row lg={1} className="mb-5">
              {recentTracks.map((track: SpotifyApi.TrackObjectSimplified, index) => (
                <Track key={index} {...track} />
              ))}
            </Row>

            {showFooter && (
              // <Container fluid className="playlist-footer fixed-bottom  border-top border-dark">
              <Container
                fluid
                className={`${
                  showFooter ? 'playlist-footer-visible' : 'playlist-footer'
                } playlist-footer fixed-bottom  border-top border-dark`}
              >
                <Container>
                  <Row>
                    <div className="d-flex align-items-center py-3 medium-emphasis-text">
                      <div>
                        <div className="fw-bold mb-2">Create Recently Played playlist</div>
                        <p className="fw-light">
                          This creates a playlist of your 50 most recently played tracks.
                        </p>
                      </div>
                      <Button
                        className="ms-auto btn-create-playlist px-4 py-2 fw-bold"
                        onClick={handleClick}
                      >
                        Create Playlist
                      </Button>
                    </div>
                  </Row>
                </Container>
              </Container>
            )}

            {playlistDetails && (
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
                    className="playlist-mosaic-pic mb-3"
                  />
                  <h5 className="fw-bold mb-4">{playlistDetails.name}</h5>
                  <Button
                    onClick={handleClose}
                    className="btn-open-on-spotify fw-bold px-4 py-3 mb-3"
                  >
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
            )}
          </Container>
        </>
      )}
    </>
  )
}

export default Recent
