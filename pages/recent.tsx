import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Track from '../components/Track'

import useAddTracksToPlaylist from '../hooks/useAddTracksToPlaylist'
import useCreatePlaylist from '../hooks/useCreatePlaylist'
import usePlaylist from '../hooks/usePlaylist'
import useUserRecentTracks from '../hooks/useUserRecentTracks'

import { showFooterOnScroll } from '../utils/showFooterOnScroll'

export default function Recent(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const [showModal, setShowModal] = useState(false)
  const [showFooter, setShowFooter] = useState(false)
  const [playlistId, setPlaylistId] = useState('')

  const recentTracksQuery = useUserRecentTracks(50)
  const playlistQuery = usePlaylist(playlistId)
  const createPlaylist = useCreatePlaylist()
  const addTracksToPlaylist = useAddTracksToPlaylist()

  let recentTracks: SpotifyApi.TrackObjectFull[] = []
  let playlist: SpotifyApi.SinglePlaylistResponse = {} as SpotifyApi.SinglePlaylistResponse

  if (recentTracksQuery.isError) {
    signOut()
    router.push('/')
  }

  if (recentTracksQuery.isSuccess) {
    recentTracks = recentTracksQuery.data!.body.items.map((item) => item.track)
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
    createPlaylist.mutate('Recently Played Tracks', {
      onSuccess: async (data) => {
        setPlaylistId(data)
        addTracksToPlaylist.mutate(
          { playlistId: data, tracks: recentTracks },
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
      <>
        <Container className="pt-5">
          <div className="d-flex align-items-center pb-5">
            <h2 className="fw-bold high-emphasis-text">Recent Tracks</h2>
          </div>
          {recentTracksQuery.isSuccess && (
            <Row lg={1} className="mb-5">
              {recentTracks.map((track: SpotifyApi.TrackObjectFull, index) => (
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
                title="Create Recently Played playlist"
                description="This creates a playlist of your 50 most recently played tracks."
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
      </>
    </main>
  )
}
