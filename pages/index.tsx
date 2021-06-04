import { useSession, signIn, signOut } from 'next-auth/client'
import { useState } from 'react'
import { useEffect } from 'react'
import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  // Spinner,
  InputGroup,
  ButtonGroup,
} from 'react-bootstrap'

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi()

export default function Home() {
  const [session, loadingSession] = useSession()
  // const [loading, setLoading] = useState(false)

  const [trackUris, setTrackUris] = useState({ uris: [] })
  // const [playlistId, setPlaylistId] = useState('')
  const [numberofTracks, setNumberofTracks] = useState(10)
  const [artistSearchQuery, setArtistSearchQuery] = useState('')
  const [seedArtist, setSeedArtist] = useState({ name: '', uri: '' })
  const [seedGenreOptions, setSeedGenreOptions] = useState(['acoustic'])
  const [seedGenre, setSeedGenre] = useState('')
  const [playlistName, setPlaylistName] = useState('New Playlist')

  let playlistId = ''

  // useEffect(() => console.log(trackUris.uris), [trackUris])
  // useEffect(() => console.log(trackUris), [trackUris])
  // useEffect(() => console.log('Seed artist: ' + seedArtist.name), [seedArtist])

  const genreOptions = seedGenreOptions.map((item) => {
    return (
      <option key={item} value={item}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </option>
    )
  })

  useEffect(() => {
    if (session) {
      const setAccessToken = () => {
        spotifyApi.setAccessToken(session.accessToken)
      }
      setAccessToken()
      const setGenreSeeds = async () => {
        spotifyApi.getAvailableGenreSeeds().then((data) => {
          let genreSeeds = data.body.genres
          setSeedGenreOptions(genreSeeds)
        })
      }
      setGenreSeeds()

      // console.log(session.user.name)
    }
  }, [session])

  const getTopTracks = async () => {
    try {
      const data = await spotifyApi.getMyTopTracks(`time_range=short_term&limit=${numberofTracks}`)
      let topTracks = data.body.items
      console.log('Got top tracks')
      setTrackUris({
        uris: data.body.items.map((item) => {
          // console.log(item.uri);
          return item.uri
        }),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const searchArtist = async () => {
    if (artistSearchQuery === '') {
      console.log('Enter search query')
    } else {
      try {
        const data = await spotifyApi.searchArtists(artistSearchQuery)
        if (data.body.artists.total === 0) {
          console.log('No results found')
        } else {
          console.log(data.body.artists.items[0].name)
          console.log('Genres: ' + data.body.artists.items[0].genres)
          setSeedArtist({
            name: data.body.artists.items[0].name,
            uri: data.body.artists.items[0].id,
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  const getRecommendations = async () => {
    try {
      const data = await spotifyApi.getRecommendations({
        seed_genres: [seedGenre],
        seed_artists: [seedArtist.uri],
        limit: numberofTracks,
      })

      let recommendations = data.body
      console.log(recommendations)
      setTrackUris({
        uris: data.body.tracks.map((item) => {
          return item.uri
        }),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const createNewPlaylist = async () => {
    try {
      const data = await spotifyApi.createPlaylist(`${playlistName}`, {
        description: '',
        public: false,
      })
      // console.log(data)
      // setPlaylistId(data.body.id)
      playlistId = data.body.id
      console.log(`Created new playlist`)
      console.log(`Playlist Name: "${playlistName}"`)
      console.log(`Playlist Id: ${playlistId}`)
    } catch (err) {
      console.log(err)
    }
  }

  const addTracksToPlaylist = async () => {
    try {
      // const data = await spotifyApi.addTracksToPlaylist(playlistId, trackUris.uris)
      const data = await spotifyApi.addTracksToPlaylist(playlistId, trackUris.uris)
      // console.log(data)
      console.log('Added tracks to playlist')
    } catch (err) {
      console.log(err)
    }
  }

  const createPlaylistAndAddTracks = async () => {
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

  return (
    <div className="bg-dark vh-100">
      <Head>
        <title>Spotify App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-dark text-white">
        <Container className="main-container min-vh-100 ">
          <Row>
            <Col>
              <h1 className="py-5 text-center fw-bold text-white">Spotify App</h1>
            </Col>
          </Row>
          <Row>
            <Col className="text-center pt-5">
              {!session && (
                <>
                  <Button onClick={() => signIn()}>Sign In</Button>
                </>
              )}
              {session && (
                <>
                  <Button className="mb-3" onClick={() => signOut()}>
                    Sign Out
                  </Button>

                  {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}

                  {/* <Button onClick={() => setLoading(!loading)} disabled={loading}>
                    Get My Spotify Data
                  </Button> */}
                  {/* {loading && <p>Loading...</p>} */}
                </>
              )}
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
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
                  {/* <Input></Input> */}
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
                      placeholder={seedArtist.name}
                      readOnly
                    />
                  </InputGroup>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row className="justify-content-center mb-5">
            <Col className="d-flex justify-content-center">
              <ButtonGroup size="lg" className="mb-3">
                <Button onClick={getTopTracks} variant="warning" className="border border-dark">
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
          </Row>
          {/* <Row>
            <Col className="d-flex justify-content-center mb-3">
              <Button
                onClick={createNewPlaylist}
                // onClick={handleClick}
                variant="success"
                className="px-4"
              >
                Create new playlist
              </Button>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center mb-3">
              <Button onClick={addTracksToPlaylist} variant="success">
                Add tracks to playlist
              </Button>
            </Col>
          </Row> */}
          <Row>
            <Col className="d-flex justify-content-center mb-3">
              <Button onClick={createPlaylistAndAddTracks} variant="success">
                Make me a playlist
              </Button>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  )
}