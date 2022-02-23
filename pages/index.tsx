import { signIn, signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'

import LogIn from '../components/LogIn'
import { SeedArtistProps, TrackUrisProps } from '../interfaces/index'

const spotifyApi = new SpotifyWebApi()

export default function Home(): JSX.Element {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  // const [loading, setLoading] = useState(false)
  const [trackUris, setTrackUris] = useState<TrackUrisProps>()
  const [numberofTracks, setNumberofTracks] = useState(10)
  const [artistSearchQuery, setArtistSearchQuery] = useState('')
  const [seedArtist, setSeedArtist] = useState<SeedArtistProps>()
  const [seedGenreOptions, setSeedGenreOptions] = useState(['acoustic'])
  const [seedGenre, setSeedGenre] = useState('')
  const [playlistName, setPlaylistName] = useState('New Playlist')

  const [userInfo, setUserInfo] = useState<SpotifyApi.CurrentUsersProfileResponse>()

  let playlistId = ''

  // useEffect(() => console.log(trackUris.uris), [trackUris])
  // useEffect(() => console.log(trackUris), [trackUris])
  // useEffect(() => console.log('Seed artist: ' + seedArtist.name), [seedArtist])
  // useEffect(() => console.log(userInfo), [userInfo])
  useEffect(() => console.log(session), [session])

  const genreOptions = seedGenreOptions.map((item) => {
    return (
      <option key={item} value={item}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </option>
    )
  })

  const setGenreSeeds = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getAvailableGenreSeeds()
      const genreSeeds = data.body.genres
      setSeedGenreOptions(genreSeeds)
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

      setGenreSeeds()
    }
  }, [session])

  const getTopTracks = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyTopTracks({
        time_range: 'short_term',
        limit: numberofTracks,
      })
      const topTracks = data.body.items
      setTrackUris({
        uris: topTracks.map((item) => {
          return item.uri
        }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const searchArtist = async (): Promise<void> => {
    if (artistSearchQuery === '') {
      console.log('Enter search query')
    } else {
      try {
        const data = await spotifyApi.searchArtists(artistSearchQuery)
        if (data!.body!.artists!.total === 0) {
          console.log('No results found')
        } else {
          setSeedArtist({
            name: data!.body!.artists!.items[0]!.name,
            uri: data!.body!.artists!.items[0]!.id,
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const getRecommendations = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getRecommendations({
        seed_genres: [seedGenre],
        seed_artists: [seedArtist!.uri],
        limit: numberofTracks,
      })
      const recommendations = data.body
      setTrackUris({
        uris: recommendations.tracks.map((item) => {
          return item.uri
        }),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const createNewPlaylist = async (): Promise<void> => {
    try {
      const data = await spotifyApi.createPlaylist(`${playlistName}`, {
        description: '',
        public: false,
      })
      playlistId = data.body.id
    } catch (err) {
      console.log(err)
    }
  }

  const addTracksToPlaylist = async (): Promise<void> => {
    try {
      await spotifyApi.addTracksToPlaylist(playlistId, trackUris!.uris)
    } catch (err) {
      console.log(err)
    }
  }

  const createPlaylistAndAddTracks = async (): Promise<void> => {
    try {
      await createNewPlaylist()

      if (playlistId !== '') {
        await addTracksToPlaylist()
      } else {
        console.log('No playlist ID')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const totalNumberOfTracks = []
  for (let i = 5; i <= 50; i += 5) {
    totalNumberOfTracks.push(
      <option key={i} value={i}>
        {i}
      </option>
    )
  }

  const getUserInfo = async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMe()
      console.log('Some information about the authenticated user', data.body)
      setUserInfo(data.body)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (session) {
      getUserInfo()
    }
  }, [session])

  return (
    <div className="vh-100">
      <Head>
        <title>Spotify App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container className="main-container min-vh-100 ">
          <Row className="text-center">
            {userInfo && (
              <div>
                <Row className="text-center d-flex justify-content-center mt-5">
                  <Image
                    src={userInfo!.images![0]!.url}
                    alt="profile picture"
                    height={150}
                    width={150}
                    className="profile-pic"
                  />
                </Row>
                <Row>
                  <h1>{userInfo!.display_name}</h1>
                </Row>
                <Row>
                  <div></div>
                </Row>
              </div>
            )}
          </Row>
          <Row>
            <Col>{/* <h1 className="py-5 text-center fw-bold text-white">Spotify App</h1> */}</Col>
          </Row>
          {!session && <LogIn />}

          <Row>
            <Col className="text-center pt-5">
              {/* {!session && (
                <>
                  <Button onClick={() => signIn('spotify')}>Sign In</Button>
                </>
              )} */}
              {session && (
                <>
                  <Button
                    variant="outline-secondary"
                    className="px-4 py-2 mb-3 logout-btn"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>

                  {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

                  {/* <Button onClick={() => setLoading(!loading)} disabled={loading}>
                    Get My Spotify Data
                  </Button> */}
                  {/* {loading && <p>Loading...</p>} */}

                  {/* <Row className="justify-content-center mb-5">
                    <Col xs={12} lg={6}>
                      <Form>
                        <Form.Group className="mb-2">
                          <Form.Label>Number of tracks</Form.Label>
                          <Form.Control
                            as="select"
                            defaultValue={numberofTracks}
                            className="bg-gray"
                            onChange={(e) => setNumberofTracks(parseInt(e.target.value))}
                          >
                            {totalNumberOfTracks}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Playlist Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder=""
                            className="bg-gray"
                            onChange={(e) => {
                              setPlaylistName(e.target.value)
                            }}
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Genre</Form.Label>
                          <Form.Control
                            as="select"
                            className="bg-gray"
                            onChange={(e) => setSeedGenre(e.target.value)}
                          >
                            <option key="" value="">
                              Select a genre
                            </option>
                            {genreOptions}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Artist</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder=""
                              className="bg-gray"
                              // onChange={(e) => setArtistSearchQuery(e.target.value)}
                              onChange={(e) => {
                                setTimeout(() => setArtistSearchQuery(e.target.value), 1)
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  searchArtist()
                                }
                              }}
                            />
                            <Form.Control
                              type="text"
                              className="bg-gray"
                              placeholder={seedArtist?.name}
                              readOnly
                            />
                          </InputGroup>
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row> */}
                  {/* <Row className="justify-content-center mb-5">
                    <Col className="d-flex justify-content-center">
                      <ButtonGroup size="lg" className="mb-3">
                        <Button
                          onClick={getTopTracks}
                          variant="warning"
                          className="border border-dark"
                        >
                          Get your top tracks
                        </Button>
                        <Button
                          onClick={getRecommendations}
                          variant="warning"
                          className="border border-dark"
                        >
                          Get recommendations
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row> */}
                  {/* <Row>
                    <Col className="d-flex justify-content-center mb-3">
                      <Button onClick={createPlaylistAndAddTracks} variant="success">
                        Make me a playlist
                      </Button>
                    </Col>
                  </Row> */}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  )
}
