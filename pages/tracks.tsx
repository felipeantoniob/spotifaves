import { Button, Col, Container, Row, ButtonGroup } from 'react-bootstrap'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'

const spotifyApi = new SpotifyWebApi()

const msToMinutesAndSeconds = (ms: number) => {
  var minutes = Math.floor(ms / 60000)
  var seconds = parseInt(((ms % 60000) / 1000).toFixed(0))
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const Tracks = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const [timeRange, setTimeRange] = useState<'long_term' | 'medium_term' | 'short_term'>(
    'long_term'
  )

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
            <h2 className="fw-bold">Top Tracks</h2>
            <ButtonGroup aria-label="Time range buttons" className="ms-auto">
              <Button
                variant="outline-secondary border-0"
                onClick={() => {
                  setTimeRange('long_term')
                }}
              >
                All Time
              </Button>
              <Button
                variant="outline-secondary border-0"
                onClick={() => {
                  setTimeRange('medium_term')
                }}
              >
                Last 6 Months
              </Button>
              <Button
                variant="outline-secondary border-0"
                onClick={() => {
                  setTimeRange('short_term')
                }}
              >
                This Month
              </Button>
            </ButtonGroup>
          </div>
          <Row lg={1} className="text-center">
            {topTracks.map((topTrack: SpotifyApi.TrackObjectFull) => {
              return (
                <div key={topTrack.id} className="mb-4 d-flex">
                  <Image
                    src={topTrack.album.images[0].url}
                    alt="album picture"
                    height={50}
                    width={50}
                  />
                  <a
                    href={topTrack.external_urls.spotify}
                    className="d-flex flex-column justify-content-center text-decoration-none text-light text-start ps-3"
                  >
                    <div>{topTrack.name}</div>
                    <div className="text-muted">
                      {topTrack.artists
                        .map((artist) => {
                          return artist.name
                        })
                        .join(', ')}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      {topTrack.album.name}
                    </div>
                  </a>
                  <a
                    href={topTrack.external_urls.spotify}
                    className="d-flex justify-content-center text-decoration-none text-muted ms-auto"
                  >
                    {msToMinutesAndSeconds(topTrack.duration_ms)}
                  </a>
                </div>
              )
            })}
          </Row>
        </Container>
      )}
    </>
  )
}

export default Tracks
