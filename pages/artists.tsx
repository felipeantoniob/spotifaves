import { Container, Row, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState, useCallback } from 'react'

import Artist from '../components/Artist'

const spotifyApi = new SpotifyWebApi()

const Artists = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>()
  const [timeRange, setTimeRange] = useState<'long_term' | 'medium_term' | 'short_term'>(
    'long_term'
  )

  const getUserTopArtists = useCallback(async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit: 50 })
      let topArtists = data.body.items
      console.log('Top Artists:')
      console.log(topArtists)
      setTopArtists(topArtists)
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
    }
  }, [session])

  useEffect(() => {
    if (session) {
      getUserTopArtists()
      setTopArtists((topArtists) => topArtists)
    }
  }, [session, timeRange, getUserTopArtists])

  return (
    <>
      {topArtists && (
        <div>
          <Container className="pt-5">
            <div className="d-flex align-items-center pb-5">
              <h2 className="fw-bold high-emphasis-text">Top Artists</h2>
              <ButtonGroup aria-label="Time range buttons" className="ms-auto">
                <ToggleButton
                  id="long-term-btn"
                  type="radio"
                  name="timerange-radio"
                  value="long_term"
                  checked={timeRange === 'long_term'}
                  onChange={(e) =>
                    setTimeRange(
                      e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term'
                    )
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
                    setTimeRange(
                      e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term'
                    )
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
                    setTimeRange(
                      e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term'
                    )
                  }
                  className="timerange-btn"
                >
                  This Month
                </ToggleButton>
              </ButtonGroup>
            </div>
            <Row lg={5} className="text-center">
              {topArtists.map((artist: SpotifyApi.ArtistObjectFull, index) => (
                <Artist key={index} {...artist} />
              ))}
            </Row>
          </Container>
        </div>
      )}
    </>
  )
}

export default Artists
