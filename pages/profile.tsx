import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

// import Sidebar from '../components/Sidebar'
import Spinner from '../components/Spinner'

import useUserFollowedArtists from '../hooks/spotify/useUserFollowedArtists'
import useUserInfo from '../hooks/spotify/useUserInfo'
import useUserPlaylists from '../hooks/spotify/useUserPlaylists'
import useUserTopArtists from '../hooks/spotify/useUserTopArtists'
import useUserTopTracks from '../hooks/spotify/useUserTopTracks'

let userInfo: SpotifyApi.CurrentUsersProfileResponse
let followedArtists: SpotifyApi.UsersFollowedArtistsResponse =
  {} as SpotifyApi.UsersFollowedArtistsResponse
let userPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse =
  {} as SpotifyApi.ListOfUsersPlaylistsResponse
let userTopTracks: SpotifyApi.TrackObjectFull[] = []
let userTopArtists: SpotifyApi.ArtistObjectFull[] = []

export default function Home(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn('spotify') // Force sign in to hopefully resolve error
    }
  }, [session])

  const userInfoQuery = useUserInfo()
  const followedArtistsQuery = useUserFollowedArtists()
  const userPlaylistsQuery = useUserPlaylists()
  const userTopTracksQuery = useUserTopTracks('long_term', 10)
  const userTopArtistsQuery = useUserTopArtists('long_term', 10)

  if (
    userInfoQuery.isLoading ||
    userTopTracksQuery.isLoading ||
    userTopArtistsQuery.isLoading ||
    userPlaylistsQuery.isLoading ||
    followedArtistsQuery.isLoading
  )
    return (
      <div>
        <Spinner />
      </div>
    )

  if (
    userInfoQuery.isError ||
    userTopTracksQuery.isError ||
    userTopArtistsQuery.isError ||
    userPlaylistsQuery.isError ||
    followedArtistsQuery.isError
  ) {
    signOut()
    router.push('/')
  }

  userInfo = userInfoQuery.data!.body
  followedArtists = followedArtistsQuery.data!.body
  userPlaylists = userPlaylistsQuery.data!.body
  userTopTracks = userTopTracksQuery.data!.body.items
  userTopArtists = userTopArtistsQuery.data!.body.items

  return (
    <div>
      {/* <Sidebar /> */}
      <main>
        <Container className="main-container min-vh-100 ">
          <Row className="text-center">
            <div>
              <Row className="d-flex justify-content-center mt-5">
                <Image
                  src={userInfo!.images![0]!.url}
                  alt="profile picture"
                  height={150}
                  width={150}
                  className="img-user-profile"
                />
              </Row>
              <Row className="mt-4">
                <a
                  href={userInfo!.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                  className="user-link text-decoration-none text-white fw-bold"
                >
                  <h1 className="fw-bold">{userInfo!.display_name}</h1>
                </a>
              </Row>

              <Row className=" justify-content-center medium-emphasis-text">
                <Col xs="auto">
                  <div className="text-green fw-bold">{userInfo!.followers!.total}</div>
                  <p className="fw-light">FOLLOWERS</p>
                </Col>
                <Col xs="auto">
                  <div className="text-green fw-bold">{followedArtists.artists.total}</div>
                  <p className="fw-light">FOLLOWING</p>
                </Col>
                <Col xs="auto">
                  <div className="text-green fw-bold">{userPlaylists.total}</div>
                  <p className="fw-light">PLAYLISTS</p>
                </Col>
              </Row>
            </div>
          </Row>
          <div>
            <Row>
              <Col className="text-center pt-5">
                <div className="mb-5">
                  <Button
                    className="btn-logout px-4 py-2 mb-3"
                    onClick={() => {
                      signOut()
                    }}
                    data-cy="logout-button"
                  >
                    Sign Out
                  </Button>
                </div>
              </Col>
            </Row>

            <Row className="pb-5">
              <Col xs={12} lg={6}>
                <Row className="d-flex justify-content-between align-items-center">
                  <Col
                    xs={12}
                    md="auto"
                    className="d-flex justify-content-center fw-bold high-emphasis-text mb-3"
                  >
                    Top Artists of All Time
                  </Col>
                  <Col xs={12} md="auto" className="d-flex justify-content-center mb-3">
                    <Link href="/artists" passHref>
                      <Button className="px-4 py-2 btn-see-more">See More</Button>
                    </Link>
                  </Col>
                </Row>
                <div className="mb-5">
                  {userTopArtists.map((artist: SpotifyApi.ArtistObjectFull, index) => (
                    <div key={index} className="d-flex align-items-center my-4">
                      <Image
                        src={artist.images[0].url}
                        alt="profile picture"
                        height={50}
                        width={50}
                        className="img-artist-profile"
                      />
                      <div className="ms-3 high-emphasis-text">{artist.name}</div>
                    </div>
                  ))}
                </div>
              </Col>
              <Col xs={12} lg={6}>
                <Row className="d-flex justify-content-between align-items-center">
                  <Col
                    xs={12}
                    md="auto"
                    className="d-flex justify-content-center fw-bold high-emphasis-text mb-3"
                  >
                    Top Tracks of All Time
                  </Col>
                  <Col xs={12} md="auto" className="d-flex justify-content-center mb-3">
                    <Link href="/tracks" passHref>
                      <Button className="px-4 py-2 btn-see-more">See More</Button>
                    </Link>
                  </Col>
                </Row>

                <div className="mb-5">
                  {userTopTracks.map((track: SpotifyApi.TrackObjectFull, index) => (
                    <div key={index} className="d-flex align-items-center my-4">
                      <Image
                        src={track.album.images[0].url}
                        alt="album picture"
                        height={50}
                        width={50}
                      />
                      <div className="ms-3">
                        <div className="high-emphasis-text">{track.name}</div>
                        <div className="medium-emphasis-text">
                          {track.artists
                            .map((artist: SpotifyApi.ArtistObjectSimplified) => {
                              return artist.name
                            })
                            .join(', ')}
                          &nbsp;&nbsp;·&nbsp;&nbsp;
                          {track.album.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </main>
    </div>
  )
}
