import { Container, Row } from 'react-bootstrap'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import useUserPlaylists from '../hooks/spotify/useUserPlaylists'

export default function Playlists(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })
  const { data: session } = useSession()

  const userPlaylistsQuery = useUserPlaylists(20)
  let userPlaylists: SpotifyApi.PlaylistObjectSimplified[] =
    {} as SpotifyApi.PlaylistObjectSimplified[]
  if (userPlaylistsQuery.isLoading) {
    return <div>Loading...</div>
  }
  if (userPlaylistsQuery.isSuccess) {
    userPlaylists = userPlaylistsQuery.data!.body.items
  }

  return (
    <main>
      {userPlaylists && (
        <Container className="pt-5">
          <h2 className="fw-bold high-emphasis-text pb-5">Your Playlists</h2>
          <Row md={2} lg={5} className="text-center mb-5">
            {userPlaylists.map((playlist: SpotifyApi.PlaylistObjectSimplified) => {
              return (
                <div key={playlist.id} className="mb-5">
                  {playlist.images?.length > 0 && (
                    <Image
                      src={playlist.images[0].url}
                      alt="profile picture"
                      height={224}
                      width={224}
                      className="img-playlist-cover"
                    />
                  )}

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
      )}
    </main>
  )
}
