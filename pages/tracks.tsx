import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Spinner from '../components/Spinner'
import TimeRangeRadio from '../components/TimeRangeRadio'
import Track from '../components/Track'
import useUserTopTracks from '../hooks/useUserTopTracks'
import { addTracksToPlaylist, createNewPlaylist, getPlaylistDetails } from '../spotify'
import { TimeRangeType } from '../types'
import { showFooterOnScroll } from '../utils/showFooterOnScroll'
import { timeRangeDescription } from '../utils/timeRangeDescription'

const Tracks = (): JSX.Element => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const [showModal, setShowModal] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRangeType>('short_term')
  const [playlistDetails, setPlaylistDetails] = useState<SpotifyApi.SinglePlaylistResponse>()

  const topTracksQuery = useUserTopTracks(timeRange, 50)
  let topTracks: SpotifyApi.TrackObjectFull[] = []

  if (topTracksQuery.isError) {
    signOut()
    router.push('/')
  }

  if (topTracksQuery.isSuccess) {
    topTracks = topTracksQuery.data!.body.items
  }

  useEffect(() => {
    showFooterOnScroll(setShowFooter)
  }, [])

  const handleCloseModal = (): void => setShowModal(false)
  const handleShowModal = (): void => setShowModal(true)

  const handleCreatePlaylist = async () => {
    try {
      const playlistId = await createNewPlaylist(`Top Tracks ${timeRangeDescription(timeRange)}`)
      await addTracksToPlaylist(playlistId!, topTracks!)
      const playlistDetails = await getPlaylistDetails(playlistId!)
      setPlaylistDetails(playlistDetails)

      handleShowModal()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main>
      <Container className="pt-5">
        <Row className="d-flex align-items-center justify-content-between pb-5">
          <Col xs={12} md="auto" className="text-center">
            <h2 className="fw-bold high-emphasis-text">Top Tracks</h2>
          </Col>
          <Col xs={12} md="auto" className="text-center">
            <TimeRangeRadio timeRange={timeRange} setTimeRange={setTimeRange} />
          </Col>
        </Row>
        {topTracksQuery.isLoading && (
          <div>
            <Spinner />
          </div>
        )}
        {topTracksQuery.isSuccess && (
          <Row lg={1} className="mb-5">
            {topTracks.map((track: SpotifyApi.TrackObjectFull, index) => (
              <Track key={index} {...track} />
            ))}
          </Row>
        )}

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
              handleClick={handleCreatePlaylist}
            />
          </Container>
        )}

        {playlistDetails && (
          <CreatedPlaylistModal
            show={showModal}
            handleClose={handleCloseModal}
            playlistDetails={playlistDetails}
          />
        )}
      </Container>
    </main>
  )
}

export default Tracks
