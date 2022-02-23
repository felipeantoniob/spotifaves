import { Button, Col, Container, Row, ButtonGroup } from 'react-bootstrap'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState, useCallback } from 'react'

const spotifyApi = new SpotifyWebApi()

const msToMinutesAndSeconds = (ms: number) => {
  var minutes = Math.floor(ms / 60000)
  var seconds = parseInt(((ms % 60000) / 1000).toFixed(0))
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

const Recent = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const [recentTracks, setRecentTracks] = useState<SpotifyApi.PlayHistoryObject[]>()

  const getRecentTracks = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyRecentlyPlayedTracks({
        limit: 20,
      })
      console.log('Your 50 most recently played tracks are:')
      //   data.body.items.forEach((item) => console.log(item.track))
      console.log(data.body.items)
      let recentTracks = data.body.items
      setRecentTracks(recentTracks)
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
            <h2 className="fw-bold">Recent Tracks</h2>
          </div>
          <Row lg={1} className="text-center">
            {recentTracks.map((recentTrack, index) => {
              return (
                <div key={index} className="mb-4 d-flex">
                  <Image
                    src={recentTrack.track.album.images[0].url}
                    alt="album picture"
                    height={50}
                    width={50}
                  />
                  <a
                    href={recentTrack.track.external_urls.spotify}
                    className="d-flex flex-column justify-content-center text-decoration-none text-light text-start ps-3"
                  >
                    <div>{recentTrack.track.name}</div>
                    <div className="text-muted">
                      {recentTrack.track.artists
                        .map((artist) => {
                          return artist.name
                        })
                        .join(', ')}
                      &nbsp;&nbsp;·&nbsp;&nbsp;
                      {recentTrack.track.album.name}
                    </div>
                  </a>
                  <a
                    href={recentTrack.track.external_urls.spotify}
                    className="d-flex justify-content-center text-decoration-none text-muted ms-auto"
                  >
                    {msToMinutesAndSeconds(recentTrack.track.duration_ms)}
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

export default Recent
