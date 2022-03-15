import { Container, Row } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState } from 'react'

import Track from '../components/Track'

const spotifyApi = new SpotifyWebApi()

const Recent = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  // const [recentTracks, setRecentTracks] = useState<SpotifyApi.PlayHistoryObject[]>()
  const [recentTracks, setRecentTracks] = useState<SpotifyApi.TrackObjectSimplified[]>()

  const getRecentTracks = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyRecentlyPlayedTracks({
        limit: 50,
      })
      console.log('Your 50 most recently played tracks are:')
      let recentTracks = data.body.items
      // console.log(recentTracks)

      let recentTrackArray = recentTracks.map((item) => item.track)
      console.log(recentTrackArray)

      setRecentTracks(recentTrackArray)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (session) {
      const setCredentials = (): void => {
        try {
          spotifyApi.setCredentials({
            accessToken: String(session.accessToken),
            refreshToken: String(session.refreshToken),
          })
        } catch (err) {
          console.log(err)
        }
      }
      setCredentials()
    }
  }, [session])

  useEffect(() => {
    if (session) {
      getRecentTracks()
    }
  }, [session])

  return (
    <>
      {recentTracks && (
        <Container className="pt-5">
          <div className="d-flex align-items-center pb-5">
            <h2 className="fw-bold high-emphasis-text">Recent Tracks</h2>
          </div>
          <Row lg={1}>
            {recentTracks.map((track: SpotifyApi.TrackObjectSimplified, index) => (
              <Track key={index} {...track} />
            ))}
          </Row>
        </Container>
      )}
    </>
  )
}

export default Recent
