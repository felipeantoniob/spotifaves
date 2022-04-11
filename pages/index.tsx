import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'

import PlaylistForm from '../components/PlaylistForm'
import Sidebar from '../components/Sidebar'

import {
  getUserPlaylists,
  getUserInfo,
  getFollowedArtists,
  getTopArtists,
  getTopTracks,
  initializeSpotifyApi,
} from '../spotify'

export default function Home(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })
  const { data: session } = useSession()

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     console.log('authenticated')
  //   }
  //   if (status === 'loading') {
  //     console.log('loading')
  //   }
  // }, [status])

  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>()
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()
  const [userInfo, setUserInfo] = useState<SpotifyApi.CurrentUsersProfileResponse>()
  const [followedArtists, setFollowedArtists] = useState<SpotifyApi.UsersFollowedArtistsResponse>()
  const [userPlaylists, setUserPlaylists] = useState<SpotifyApi.ListOfUsersPlaylistsResponse>()

  // useEffect(() => console.log(session), [session])

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn('spotify') // Force sign in to hopefully resolve error
    }
  }, [session])

  useEffect(() => {
    const fetchData = async () => {
      try {
        await initializeSpotifyApi()
        const userInfo = await getUserInfo()
        setUserInfo(userInfo)
        const followedArtists = await getFollowedArtists()
        setFollowedArtists(followedArtists)
        const userPlaylists = await getUserPlaylists()
        setUserPlaylists(userPlaylists)
        const topArtists = await getTopArtists('long_term', 10)
        setTopArtists(topArtists)
        const topTracks = await getTopTracks('long_term', 10)
        setTopTracks(topTracks)
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* <Sidebar /> */}
      <main>
        <Container className="main-container min-vh-100 ">
          <Row className="text-center">
            {userInfo && (
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
                {!!followedArtists && !!userPlaylists && (
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
                )}
              </div>
            )}
          </Row>

          <div>
            <Row>
              <Col className="text-center pt-5">
                {/* <PlaylistForm /> */}
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
              {topArtists && topTracks && (
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
                  {topArtists && (
                    <div className="mb-5">
                      {topArtists.map((artist: SpotifyApi.ArtistObjectFull, index) => (
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
                        // <Artist key={index} {...artist} />
                      ))}
                    </div>
                  )}
                </Col>
              )}
              {topTracks && topArtists && (
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

                  {topTracks && (
                    <div className="mb-5">
                      {topTracks.map((track: SpotifyApi.TrackObjectFull, index) => (
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
                  )}
                </Col>
              )}
            </Row>
          </div>
        </Container>
      </main>
    </div>
  )
}
