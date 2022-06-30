import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import TimeRangeRadio from '../components/TimeRangeRadio'
import Track from '../components/Track'
import { timeRangeDescription } from '../utils'
import {
  getTopTracks,
  addTracksToPlaylist,
  createNewPlaylist,
  getPlaylistDetails,
} from '../spotify'
import { timeRangeType as TimeRangeType } from '../types'

const Tracks = (): JSX.Element => {
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
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const [timeRange, setTimeRange] = useState<TimeRangeType>('short_term')
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
      if (session) {
        const topTracks = await getTopTracks(timeRange, 50)
        setTopTracks(topTracks)
      }
    }
    fetchData()
  }, [session, timeRange])

  const handleClick = async () => {
    try {
      const playlistId = await createNewPlaylist(`Top Tracks ${timeRangeDescription(timeRange)}`)
      await addTracksToPlaylist(playlistId!, topTracks!)
      const playlistDetails = await getPlaylistDetails(playlistId!)
      setPlaylistDetails(playlistDetails)

      handleShow()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main>
      {topTracks && (
        <Container className="pt-5">
          <Row className="d-flex align-items-center justify-content-between pb-5">
            <Col xs={12} md="auto" className="text-center">
              <h2 className="fw-bold high-emphasis-text">Top Tracks</h2>
            </Col>
            <Col xs={12} md="auto" className="text-center">
              <TimeRangeRadio timeRange={timeRange} setTimeRange={setTimeRange} />
            </Col>
          </Row>
          <Row lg={1} className="mb-5">
            {topTracks.map((track: SpotifyApi.TrackObjectFull, index) => (
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
              <CreatePlaylistFooter
                title="Create Top Tracks playlist"
                description="This creates a playlist of your top 50 tracks."
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

export default Tracks
