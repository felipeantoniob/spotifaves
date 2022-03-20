import Image from 'next/image'
import { Button, Container, Modal, Row, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'

import Artist from '../components/Artist'
import TimeRangeRadio from '../components/TimeRangeRadio'
import { shuffleArray } from '../utils'
import { timeRangeDescription } from '../utils'

import {
  getTopArtists,
  addTracksToPlaylist,
  createNewPlaylist,
  getPlaylistDetails,
  getTopArtistsTopTracks,
} from '../spotify'

const Artists = (): JSX.Element => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('authenticated')
    }
    if (status === 'loading') {
      console.log('loading')
    }
  }, [status])

  const { data: session } = useSession()

  const [show, setShow] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>()
  const [timeRange, setTimeRange] = useState<'long_term' | 'medium_term' | 'short_term'>(
    'long_term'
  )
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
          const topArtists = await getTopArtists(timeRange, 50)
          setTopArtists(topArtists)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [session, timeRange])

  const handleClick = async () => {
    try {
      const topArtistTopTracks = await getTopArtistsTopTracks(topArtists!, 20, 5)
      const playlistId = await createNewPlaylist(
        `Top 20 Artists ${timeRangeDescription(timeRange)}`
      )
      await addTracksToPlaylist(playlistId!, shuffleArray(topArtistTopTracks!))
      const playlistDetails = await getPlaylistDetails(playlistId!)
      setPlaylistDetails(playlistDetails)

      handleShow()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {topArtists && (
        <Container className="pt-5">
          {/* <button onClick={getTopArtistsTopTracks}>test</button> */}
          <div className="d-flex align-items-center pb-5">
            <h2 className="fw-bold high-emphasis-text">Top Artists</h2>
            <TimeRangeRadio timeRange={timeRange} setTimeRange={setTimeRange} />
          </div>
          <Row lg={5} className="text-center mb-5">
            {topArtists.map((artist: SpotifyApi.ArtistObjectFull, index) => (
              <Artist key={index} {...artist} />
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
                      <div className="fw-bold mb-2">Create Top Artists playlist</div>
                      <p className="fw-light">
                        This creates a playlist from your Top 20 artists with Top 5 tracks from each
                        artist in random order.
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
                  draggable="false"
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
      )}
    </>
  )
}

export default Artists
