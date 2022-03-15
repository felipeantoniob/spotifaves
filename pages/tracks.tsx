import { Container, Row, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState, useCallback } from 'react'

import Track from '../components/Track'

const spotifyApi = new SpotifyWebApi()

const Tracks = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const [timeRange, setTimeRange] = useState<'long_term' | 'medium_term' | 'short_term'>(
    'long_term'
  )
  const [checked, setChecked] = useState(false)

  const getTopTracks = useCallback(async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyTopTracks({ time_range: timeRange, limit: 50 })
      let topTracks = data.body.items
      console.log('Top Tracks:')
      console.log(topTracks)
      setTopTracks(topTracks)
    } catch (err) {
      console.error(err)
    }
  }, [timeRange])

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

      // getUserInfo()
      // getUserTopArtists()
    }
  }, [session])

  useEffect(() => {
    if (session) {
      getTopTracks()
      setTopTracks((topTracks) => topTracks)
    }
  }, [session, timeRange, getTopTracks])

  return (
    <>
      {topTracks && (
        <Container className="pt-5">
          <div className="d-flex align-items-center pb-5">
            <h2 className="fw-bold high-emphasis-text">Top Tracks</h2>
            <ButtonGroup aria-label="Time range buttons" className="ms-auto">
              <ToggleButton
                id="long-term-btn"
                type="radio"
                name="timerange-radio"
                value="long_term"
                checked={timeRange === 'long_term'}
                onChange={(e) =>
                  setTimeRange(e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term')
                }
                className="timerange-btn"
              >
                All Time
              </ToggleButton>
              <ToggleButton
                id="medium-term-btn"
                type="radio"
                name="timerange-radio"
                value="medium_term"
                checked={timeRange === 'medium_term'}
                onChange={(e) =>
                  setTimeRange(e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term')
                }
                className="timerange-btn"
              >
                Last 6 Months
              </ToggleButton>
              <ToggleButton
                id="short-term-btn"
                type="radio"
                name="timerange-radio"
                value="short_term"
                checked={timeRange === 'short_term'}
                onChange={(e) =>
                  setTimeRange(e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term')
                }
                className="timerange-btn"
              >
                This Month
              </ToggleButton>
            </ButtonGroup>
          </div>
          <Row lg={1}>
            {topTracks.map((track: SpotifyApi.TrackObjectFull, index) => (
              <Track key={index} {...track} />
            ))}
          </Row>
        </Container>
      )}
    </>
  )
}

export default Tracks
