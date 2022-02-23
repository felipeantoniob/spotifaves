import { Button, Col, Container, Row, ButtonGroup } from 'react-bootstrap'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState, useCallback } from 'react'

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
              <h2 className="fw-bold">Top Artists</h2>
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
            <Row lg={5} className="text-center">
              {topArtists.map((topArtist: SpotifyApi.ArtistObjectFull) => {
                return (
                  <div key={topArtist.id} className="mb-3">
                    <Image
                      src={topArtist.images[0].url}
                      alt="profile picture"
                      height={200}
                      width={200}
                      className="artist-profile-pic"
                    />
                    <a
                      href={topArtist.external_urls.spotify}
                      className="d-flex justify-content-center pt-3 text-decoration-none text-light"
                    >
                      {topArtist.name}
                    </a>
                  </div>
                )
              })}
            </Row>
          </Container>
        </div>
      )}
    </>
  )
}

export default Artists
