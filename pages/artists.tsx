import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import Artist from '../components/Artist'
import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Spinner from '../components/Spinner'
import TimeRangeRadio from '../components/TimeRangeRadio'

import useAddTracksToPlaylist from '../hooks/spotify/useAddTracksToPlaylist'
import useCreatePlaylist from '../hooks/spotify/useCreatePlaylist'
import usePlaylist from '../hooks/spotify/usePlaylist'
import useUserTopArtists from '../hooks/spotify/useUserTopArtists'
import useFooterOnScroll from '../hooks/useFooterOnScroll'
import useModal from '../hooks/useModal'

import { TimeRangeType } from '../components/TimeRangeRadio'
import { getMultipleArtistsTopTracks } from '../utils/getMultipleArtistsTopTracks'
import { shuffleTracks } from '../utils/shuffleTracks'
import { timeRangeDescription } from '../utils/timeRangeDescription'

let topArtists: SpotifyApi.ArtistObjectFull[] = []
let playlist: SpotifyApi.SinglePlaylistResponse = {} as SpotifyApi.SinglePlaylistResponse

export default function Artists(): JSX.Element {
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
  const topArtistsQuery = useUserTopArtists(timeRange, 50)
  const playlistQuery = usePlaylist(playlistId)
  const createPlaylist = useCreatePlaylist()
  const addTracksToPlaylist = useAddTracksToPlaylist()

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
              toggleModal()
            },
          }
        )
      },
    })
  }

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
