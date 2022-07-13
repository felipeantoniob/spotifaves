import { Container, Row, Col } from 'react-bootstrap'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Artist from '../components/Artist'
import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import TimeRangeRadio from '../components/TimeRangeRadio'
import useUserTopArtists from '../hooks/useUserTopArtists'

import Spinner from '../components/Spinner'

import { timeRangeDescription } from '../utils/timeRangeDescription'
import { showFooterOnScroll } from '../utils/showFooterOnScroll'
import { shuffleTracks } from '../utils/shuffleTracks'
import {
  addTracksToPlaylist,
  createNewPlaylist,
  getPlaylistDetails,
  getMultipleArtistsTopTracks,
} from '../spotify'
import { TimeRangeType } from '../types'

const Artists = (): JSX.Element => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const { data: session } = useSession()

  const [showModal, setShowModal] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  const [timeRange, setTimeRange] = useState<TimeRangeType>('short_term')
  const [playlistDetails, setPlaylistDetails] = useState<SpotifyApi.SinglePlaylistResponse>()

  const topArtistsQuery = useUserTopArtists(timeRange, 50)
  let topArtists: SpotifyApi.ArtistObjectFull[] = []

  if (topArtistsQuery.isError) {
    signOut()
    router.push('/')
  }

  if (topArtistsQuery.isSuccess) {
    topArtists = topArtistsQuery.data!.body.items
  }

  useEffect(() => {
    showFooterOnScroll(setShowFooter)
  }, [])

  const handleCloseModal = (): void => setShowModal(false)
  const handleShowModal = (): void => setShowModal(true)

  const handleCreatePlaylist = async () => {
    try {
      const topArtistTopTracks = await getMultipleArtistsTopTracks(topArtists!, 20, 5)
      const playlistId = await createNewPlaylist(
        `Top 20 Artists ${timeRangeDescription(timeRange)}`
      )
      await addTracksToPlaylist(playlistId!, shuffleTracks(topArtistTopTracks!))
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
            <h2 className="fw-bold high-emphasis-text">Top Artists</h2>
          </Col>
          <Col xs={12} md="auto" className="text-center">
            <TimeRangeRadio timeRange={timeRange} setTimeRange={setTimeRange} />
          </Col>
        </Row>
        {topArtistsQuery.isLoading && (
          <div>
            <Spinner />
          </div>
        )}
        {topArtistsQuery.isSuccess && (
          <Row md={2} lg={5} className="text-center mb-5">
            {topArtists.map((artist: SpotifyApi.ArtistObjectFull, index) => (
              <Artist key={index} {...artist} />
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
              title="Create Top Artists playlist"
              description="This creates a playlist from your Top 20 artists with Top 5 tracks from each
                artist in random order."
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

export default Artists
