import { Button, Col, Container, Form, InputGroup, Row, ButtonGroup } from 'react-bootstrap'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import SpotifyWebApi from 'spotify-web-api-node'
import { useEffect, useState } from 'react'

const spotifyApi = new SpotifyWebApi()

const Playlists = () => {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>()

  const getPlaylists = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getUserPlaylists()
      // console.log('Retrieved playlists', data.body.items)
      let playlists = data.body.items
      setPlaylists(playlists)
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
      getPlaylists()
    }
  }, [session])

  return (
    <Container className="pt-5">
      <div>
        {playlists && (
          <div>
            <h2 className="pb-5">Your Playlists</h2>
            <Row lg={5} className="text-center">
              {playlists.map((playlist: SpotifyApi.PlaylistObjectSimplified) => {
                return (
                  <div key={playlist.id} className="mb-3">
                    <Image
                      src={playlist.images[0].url}
                      alt="profile picture"
                      height={224}
                      width={224}
                      className="playlist-pic"
                    />
                    <a
                      href={playlist.external_urls.spotify}
                      className="d-flex justify-content-center pt-3 text-decoration-none text-light"
                    >
                      {playlist.name}
                    </a>
                  </div>
                )
              })}
            </Row>
          </div>
        )}
      </div>
    </Container>
  )
}

export default Playlists
