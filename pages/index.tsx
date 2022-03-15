import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'

import LogIn from '../components/LogIn'
import PlaylistForm from '../components/PlaylistForm'
import { SeedArtistProps, TrackUrisProps } from '../interfaces/index'

const spotifyApi = new SpotifyWebApi()

export default function Home(): JSX.Element {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [trackUris, setTrackUris] = useState<TrackUrisProps>()
  const [numberofTracks, setNumberofTracks] = useState(10)
  const [artistSearchQuery, setArtistSearchQuery] = useState('')
  const [seedArtist, setSeedArtist] = useState<SeedArtistProps>()
  const [seedGenreOptions, setSeedGenreOptions] = useState(['acoustic'])
  const [seedGenre, setSeedGenre] = useState('')
  const [playlistName, setPlaylistName] = useState('New Playlist')

  const [userInfo, setUserInfo] = useState<SpotifyApi.CurrentUsersProfileResponse>()
  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>()
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>()

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

  // const getTopTracks = async (): Promise<void> => {
  //   try {
  //     const data = await spotifyApi.getMyTopTracks({
  //       time_range: 'short_term',
  //       limit: numberofTracks,
  //     })
  //     const topTracks = data.body.items
  //     setTrackUris({
  //       uris: topTracks.map((item) => {
  //         return item.uri
  //       }),
  //     })
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

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

  const getUserTopArtists = useCallback(async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyTopArtists({ time_range: 'long_term', limit: 10 })
      let topArtists = data.body.items
      setTopArtists(topArtists)
      console.log(topArtists)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (session) {
      getUserTopArtists()
      setTopArtists((topArtists) => topArtists)
    }
  }, [session, getUserTopArtists])

  const getTopTracks = useCallback(async (): Promise<void> => {
    try {
      const data = await spotifyApi.getMyTopTracks({ time_range: 'long_term', limit: 10 })
      let topTracks = data.body.items
      setTopTracks(topTracks)
    } catch (err) {
      console.error(err)
    }
  }, [])

  useEffect(() => {
    if (session) {
      getTopTracks()
      setTopTracks((topTracks) => topTracks)
    }
  }, [session, getTopTracks])

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
                <Row className="mt-4 high-emphasis-text">
                  <h1>{userInfo!.display_name}</h1>
                </Row>
                <Row>
                  <div></div>
                </Row>
              </div>
            )}
          </Row>

          {!session && <LogIn />}

          <Row>
            <Col className="text-center pt-5">
              {/* {!session && (
                <>
                  <Button onClick={() => signIn('spotify')}>Sign In</Button>
                </>
              )} */}
              {/* <PlaylistForm /> */}
              {session && (
                <div className="mb-5">
                  <Button className="px-4 py-2 mb-3 logout-btn" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>
              )}
            </Col>
          </Row>
          <Row>
            {topArtists && (
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold high-emphasis-text">Top Artists of All Time</div>
                  <Link href="/artists" passHref>
                    <Button className="px-4 py-2 me-4 logout-btn">See More</Button>
                  </Link>
                </div>
                {topArtists.map((artist: SpotifyApi.ArtistObjectFull, index) => (
                  <div key={index} className="d-flex align-items-center my-4">
                    <Image
                      src={artist.images[0].url}
                      alt="profile picture"
                      height={50}
                      width={50}
                      className="artist-profile-pic"
                    />
                    <div className="ms-3 high-emphasis-text">{artist.name}</div>
                  </div>
                  // <Artist key={index} {...artist} />
                ))}
              </Col>
            )}
            {topTracks && (
              <Col>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold high-emphasis-text">Top Tracks of All Time</div>
                  <Link href="/tracks" passHref>
                    <Button className="px-4 py-2 me-4 logout-btn">See More</Button>
                  </Link>
                </div>
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
              </Col>
            )}
          </Row>
        </Container>
      </main>
    </div>
  )
}
