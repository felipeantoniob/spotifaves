import { Container, Row } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Track from '../components/Track'
import CreatePlaylistFooter from '../components/CreatePlaylistFooter'
import CreatedPlaylistModal from '../components/CreatedPlaylistModal'
import {
  addTracksToPlaylist,
  createNewPlaylist,
  getPlaylistDetails,
  getRecentlyPlayedTracks,
} from '../spotify'

const Recent = (): JSX.Element => {
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

  const [recentTracks, setRecentTracks] = useState<SpotifyApi.TrackObjectSimplified[]>()
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
      try {
        if (session) {
          const recentTracks = await getRecentlyPlayedTracks()
          setRecentTracks(recentTracks)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [session])

  const handleClick = async () => {
    try {
      const playlistId = await createNewPlaylist('Recently Played Tracks')
      await addTracksToPlaylist(playlistId!, recentTracks!)
      const playlistDetails = await getPlaylistDetails(playlistId!)
      setPlaylistDetails(playlistDetails)

      handleShow()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main>
      {recentTracks && (
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
        </>
      )}
    </main>
  )
}

export default Recent
