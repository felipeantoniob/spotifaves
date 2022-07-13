import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'

import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import Track from '../components/Track'
import { addTracksToPlaylist, createNewPlaylist, getPlaylistDetails } from '../spotify'
import { showFooterOnScroll } from '../utils/showFooterOnScroll'

import useUserRecentTracks from '../hooks/useUserRecentTracks'

const Recent = (): JSX.Element => {
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

  const [playlistDetails, setPlaylistDetails] = useState<SpotifyApi.SinglePlaylistResponse>()

  useEffect(() => {
    showFooterOnScroll(setShowFooter)
  }, [])

  const recentTracksQuery = useUserRecentTracks(50)
  let recentTracks: SpotifyApi.TrackObjectSimplified[] = []

  if (recentTracksQuery.isError) {
    signOut()
    router.push('/')
  }

  if (recentTracksQuery.isLoading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    )

  if (recentTracksQuery.isSuccess) {
    recentTracks = recentTracksQuery.data!.body.items.map((item) => item.track)
  }

  const handleModalClose = (): void => setShowModal(false)
  const handleModalShow = (): void => setShowModal(true)

  const handleCreatePlaylist = async () => {
    try {
      const playlistId = await createNewPlaylist('Recently Played Tracks')
      await addTracksToPlaylist(playlistId!, recentTracks!)
      const playlistDetails = await getPlaylistDetails(playlistId!)
      setPlaylistDetails(playlistDetails)

      handleModalShow()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main>
      <>
        <Container className="pt-5">
          <div className="d-flex align-items-center pb-5">
            <h2 className="fw-bold high-emphasis-text">Recent Tracks</h2>
          </div>
          <Row lg={1} className="mb-5">
            {recentTracks.map((track: SpotifyApi.TrackObjectSimplified, index) => (
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
                title="Create Recently Played playlist"
                description="This creates a playlist of your 50 most recently played tracks."
                handleClick={handleCreatePlaylist}
              />
            </Container>
          )}

          {playlistDetails && (
            <CreatedPlaylistModal
              show={showModal}
              handleClose={handleModalClose}
              playlistDetails={playlistDetails}
            />
          )}
        </Container>
      </>
    </main>
  )
}

export default Recent
