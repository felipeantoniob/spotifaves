import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Spinner from '../components/Spinner'
import TimeRangeRadio from '../components/TimeRangeRadio'
import Track from '../components/Track'

import useAddTracksToPlaylist from '../hooks/useAddTracksToPlaylist'
import useCreatePlaylist from '../hooks/useCreatePlaylist'
import usePlaylist from '../hooks/usePlaylist'
import useUserTopTracks from '../hooks/useUserTopTracks'

import { TimeRangeType } from '../types'

import { showFooterOnScroll } from '../utils/showFooterOnScroll'
import { timeRangeDescription } from '../utils/timeRangeDescription'

export default function Tracks(): JSX.Element {
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
  const [playlistId, setPlaylistId] = useState('')

  const playlistQuery = usePlaylist(playlistId)
  const topTracksQuery = useUserTopTracks(timeRange, 50)
  const createPlaylist = useCreatePlaylist()
  const addTracksToPlaylist = useAddTracksToPlaylist()

  let topTracks: SpotifyApi.TrackObjectFull[] = []
  let playlist: SpotifyApi.SinglePlaylistResponse = {} as SpotifyApi.SinglePlaylistResponse

  if (topTracksQuery.isError) {
    signOut()
    router.push('/')
  }

  if (topTracksQuery.isSuccess) {
    topTracks = topTracksQuery.data!.body.items
  }

  if (playlistQuery.isSuccess) {
    playlist = playlistQuery.data.body
  }

  useEffect(() => {
    showFooterOnScroll(setShowFooter)
  }, [])

  const handleCloseModal = (): void => setShowModal(false)
  const handleShowModal = (): void => setShowModal(true)

  const handleCreatePlaylist = async () => {
    createPlaylist.mutate(`Top Tracks ${timeRangeDescription(timeRange)}`, {
      onSuccess: async (data) => {
        setPlaylistId(data)
        addTracksToPlaylist.mutate(
          { playlistId: data, tracks: topTracks },
          {
            onSuccess: async (data) => {
              playlistQuery.refetch()
              handleShowModal()
            },
          }
        )
      },
    })
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

        {playlist.images?.length > 0 && (
          <CreatedPlaylistModal
            show={showModal}
            handleClose={handleCloseModal}
            playlistDetails={playlist}
          />
        )}
      </Container>
    </main>
  )
}
