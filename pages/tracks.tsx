import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Spinner from '../components/Spinner'
import TimeRangeRadio from '../components/TimeRangeRadio'
import Track from '../components/Track'

import useAddTracksToPlaylist from '../hooks/spotify/useAddTracksToPlaylist'
import useCreatePlaylist from '../hooks/spotify/useCreatePlaylist'
import usePlaylist from '../hooks/spotify/usePlaylist'
import useUserTopTracks from '../hooks/spotify/useUserTopTracks'
import useFooterOnScroll from '../hooks/useFooterOnScroll'
import useModal from '../hooks/useModal'

import { TimeRangeType } from '../components/TimeRangeRadio'
import { timeRangeDescription } from '../utils/timeRangeDescription'

let topTracks: SpotifyApi.TrackObjectFull[] = []
let playlist: SpotifyApi.SinglePlaylistResponse = {} as SpotifyApi.SinglePlaylistResponse

export default function Tracks(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const [timeRange, setTimeRange] = useState<TimeRangeType>('short_term')
  const [playlistId, setPlaylistId] = useState('')

  const { showFooter } = useFooterOnScroll()
  const { isModalShowing, toggleModal } = useModal()
  const playlistQuery = usePlaylist(playlistId)
  const topTracksQuery = useUserTopTracks(timeRange, 50)
  const createPlaylist = useCreatePlaylist()
  const addTracksToPlaylist = useAddTracksToPlaylist()

  const handleCreatePlaylist = async () => {
    createPlaylist.mutate(`Top Tracks ${timeRangeDescription(timeRange)}`, {
      onSuccess: async (data) => {
        setPlaylistId(data)
        addTracksToPlaylist.mutate(
          { playlistId: data, tracks: topTracks },
          {
            onSuccess: async (data) => {
              playlistQuery.refetch()
              toggleModal()
            },
          }
        )
      },
    })
  }

  if (topTracksQuery.isError) {
    signOut()
    router.push('/')
  }

  if (topTracksQuery.isSuccess) {
    topTracks = topTracksQuery.data.body.items
  }

  if (playlistQuery.isSuccess) {
    playlist = playlistQuery.data.body
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
            show={isModalShowing}
            handleClose={toggleModal}
            playlistDetails={playlist}
          />
        )}
      </Container>
    </main>
  )
}
