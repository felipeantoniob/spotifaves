import { Container, Row } from 'react-bootstrap'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getUserPlaylists } from '../spotify'

const Playlists = (): JSX.Element => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })
  const { data: session } = useSession()
  const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const playlists = await getUserPlaylists(50)
          setPlaylists(playlists!.items)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [session])

  return (
    <main>
      {playlists && (
        <>
          <Container className="pt-5">
            <h2 className="fw-bold high-emphasis-text pb-5">Your Playlists</h2>
            <Row md={2} lg={5} className="text-center mb-5">
              {playlists.map((playlist: SpotifyApi.PlaylistObjectSimplified) => {
                return (
                  <div key={playlist.id} className="mb-5">
                    <Image
                      src={playlist.images[0].url}
                      alt="profile picture"
                      height={224}
                      width={224}
                      className="img-playlist-cover"
                    />
                    <a
                      href={playlist.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="d-flex justify-content-center pt-3 text-decoration-none text-light"
                    >
                      {playlist.name}
                    </a>
                    <p className="medium-emphasis-text fw-light subtitle-text">
                      {playlist.tracks.total} TRACKS
                    </p>
                  </div>
                )
              })}
            </Row>
          </Container>
        </>
      )}
    </main>
  )
}

export default Playlists
