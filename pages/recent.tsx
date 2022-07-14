import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Container, Row } from 'react-bootstrap'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Track from '../components/Track'

import useAddTracksToPlaylist from '../hooks/spotify/useAddTracksToPlaylist'
import useCreatePlaylist from '../hooks/spotify/useCreatePlaylist'
import usePlaylist from '../hooks/spotify/usePlaylist'
import useUserRecentTracks from '../hooks/spotify/useUserRecentTracks'
import useFooterOnScroll from '../hooks/useFooterOnScroll'
import useModal from '../hooks/useModal'

let recentTracks: SpotifyApi.TrackObjectFull[] = []
let playlist: SpotifyApi.SinglePlaylistResponse = {} as SpotifyApi.SinglePlaylistResponse

export default function Recent(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const [playlistId, setPlaylistId] = useState('')

  const { showFooter } = useFooterOnScroll()
  const { isModalShowing, toggleModal } = useModal()
  const recentTracksQuery = useUserRecentTracks(50)
  const playlistQuery = usePlaylist(playlistId)
  const createPlaylist = useCreatePlaylist()
  const addTracksToPlaylist = useAddTracksToPlaylist()

  const handleCreatePlaylist = async () => {
    createPlaylist.mutate('Recently Played Tracks', {
      onSuccess: async (data) => {
        setPlaylistId(data)
        addTracksToPlaylist.mutate(
          { playlistId: data, tracks: recentTracks },
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
              show={isModalShowing}
              handleClose={toggleModal}
              playlistDetails={playlist}
            />
          )}
        </Container>
      </>
    </main>
  )
}
