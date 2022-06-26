import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Container, Row, Col } from 'react-bootstrap'

import GenrePieChart from '../components/GenrePieChart'
import TimeRangeRadio from '../components/TimeRangeRadio'
import { getTopArtists } from '../spotify'
import { timeRangeType } from '../types'
import { getGenreChartData, getGenreFrequency, getAllGenres } from '../utils'

interface GenreObjectProps {
  genre: string
  artists: string[]
}

const Genres = () => {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login')
    },
  })

  const { data: session } = useSession()

  const [topArtists, setTopArtists] = useState<SpotifyApi.ArtistObjectFull[]>()
  const [timeRange, setTimeRange] = useState<timeRangeType>('short_term')
  const [genreChartData, setGenreChartData] = useState<GenreObjectProps[]>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const topArtists = await getTopArtists(timeRange, 20)
          setTopArtists(topArtists)

          const allGenresArray = getAllGenres(topArtists!)

          const genreFrequencyArray = getGenreFrequency(allGenresArray)

          const topGenresArray = Object.entries(genreFrequencyArray)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map((genre) => genre[0])

          const genresArtistsObject = getGenreChartData(topGenresArray, topArtists!)
          setGenreChartData(genresArtistsObject)
        }
      } catch (err) {
        console.log(err)
      }
    }
    fetchData()
  }, [session, timeRange])

  return (
    <main>
      {genreChartData && (
        <>
          <Container className="pt-5">
            <Row className="d-flex align-items-center justify-content-between pb-5">
              <Col xs={12} md="auto" className="text-center">
                <h2 className="fw-bold high-emphasis-text">Top Genres</h2>
              </Col>
              <Col xs={12} md="auto" className="text-center">
                <TimeRangeRadio timeRange={timeRange} setTimeRange={setTimeRange} />
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <Row className="justify-content-center mb-5">
              <Col xs={12} md={9} lg={6} xl={4}>
                {!!genreChartData && !!topArtists && (
                  <GenrePieChart genreChartData={genreChartData} topArtists={topArtists} />
                )}
              </Col>
            </Row>
          </Container>
        </>
      )}
    </main>
  )
}

export default Genres
