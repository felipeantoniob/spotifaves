import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import Artist from '../components/Artist'
import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Spinner from '../components/Spinner'
import TimeRangeRadio from '../components/TimeRangeRadio'

import useAddTracksToPlaylist from '../hooks/useAddTracksToPlaylist'
import useCreatePlaylist from '../hooks/useCreatePlaylist'
import usePlaylist from '../hooks/usePlaylist'
import useUserTopArtists from '../hooks/useUserTopArtists'

import { TimeRangeType } from '../types'

import { getMultipleArtistsTopTracks } from '../utils/getMultipleArtistsTopTracks'
import { showFooterOnScroll } from '../utils/showFooterOnScroll'
import { shuffleTracks } from '../utils/shuffleTracks'
import { timeRangeDescription } from '../utils/timeRangeDescription'

export default function Artists(): JSX.Element {
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

  const [playlistId, setPlaylistId] = useState('')
  const playlistQuery = usePlaylist(playlistId)
  const createPlaylist = useCreatePlaylist()
  const addTracksToPlaylist = useAddTracksToPlaylist()
  let playlist: SpotifyApi.SinglePlaylistResponse = {} as SpotifyApi.SinglePlaylistResponse

  if (topArtistsQuery.isError) {
    signOut()
    router.push('/')
  }
  if (topArtistsQuery.isSuccess) {
    topArtists = topArtistsQuery.data!.body.items
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
    const topArtistTopTracks = await getMultipleArtistsTopTracks(topArtists!, 20, 5)
    createPlaylist.mutate(`Top 20 Artists ${timeRangeDescription(timeRange)}`, {
      onSuccess: async (data) => {
        setPlaylistId(data)
        addTracksToPlaylist.mutate(
          { playlistId: data, tracks: shuffleTracks(topArtistTopTracks!) },
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
        {/* {playlistDetails && (
          <CreatedPlaylistModal
            show={showModal}
            handleClose={handleCloseModal}
            playlistDetails={playlistDetails}
          />
        )} */}
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
