import { Container, Row, Col } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'

import Artist from '../components/Artist'
import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import TimeRangeRadio from '../components/TimeRangeRadio'

import { shuffleArray } from '../utils'
import { timeRangeDescription } from '../utils'
import {
  addTracksToPlaylist,
  createNewPlaylist,
  getPlaylistDetails,
  getTopArtists,
  getTopArtistsTopTracks,
} from '../spotify'
import { timeRangeType } from '../types'

const Artists = (): JSX.Element => {
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

  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>()
  const [timeRange, setTimeRange] = useState<timeRangeType>('long_term')
  const [playlistDetails, setPlaylistDetails] = useState<SpotifyApi.SinglePlaylistResponse>()

  useEffect(() => {
    const showFooterOnScroll = () => {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
          setShowFooter(true)
        } else {
          setShowFooter(false)
        }
      })
    }
    showFooterOnScroll()
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
    <main>
      {topArtists && (
        <Container className="pt-5">
          <Row className="d-flex align-items-center justify-content-between pb-5">
            <Col xs={12} md="auto" className="text-center">
              <h2 className="fw-bold high-emphasis-text">Top Artists</h2>
            </Col>
            <Col xs={12} md="auto" className="text-center">
              <TimeRangeRadio timeRange={timeRange} setTimeRange={setTimeRange} />
            </Col>
          </Row>
          <Row md={2} lg={5} className="text-center mb-5">
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
              <CreatePlaylistFooter
                title="Create Top Artists playlist"
                description="This creates a playlist from your Top 20 artists with Top 5 tracks from each
                artist in random order."
                handleClick={handleClick}
              />
            </Container>
          )}
          {playlistDetails && (
            <CreatedPlaylistModal
              show={show}
              handleClose={handleClose}
              playlistDetails={playlistDetails}
            />
          )}
        </Container>
      )}
    </main>
  )
}

export default Artists
