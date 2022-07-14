import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import GenrePieChart from '../components/GenrePieChart'
import Spinner from '../components/Spinner'
import TimeRangeRadio from '../components/TimeRangeRadio'
import useUserTopArtists from '../hooks/useUserTopArtists'
import { GenreObject, TimeRangeType } from '../types'
import { getAllGenres } from '../utils/getAllGenres'
import { getGenreChartData } from '../utils/getGenreChartData'
import { getGenreFrequency } from '../utils/getGenreFrequency'

export default function Genres(): JSX.Element {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    },
  })

  const [timeRange, setTimeRange] = useState<TimeRangeType>('short_term')

  let genreChartData: GenreObject[] = []

  const topArtistsQuery = useUserTopArtists(timeRange, 50)
  let topArtists: SpotifyApi.ArtistObjectFull[] = []

  if (topArtistsQuery.isError) {
    signOut()
    router.push('/')
  }

  if (topArtistsQuery.isSuccess) {
    topArtists = topArtistsQuery.data!.body.items
    const allGenresArray = getAllGenres(topArtists!)
    const genreFrequencyArray = getGenreFrequency(allGenresArray)
    const topGenresArray = Object.entries(genreFrequencyArray)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map((genre) => genre[0])
    const genresArtistsObject = getGenreChartData(topGenresArray, topArtists!)
    genreChartData = genresArtistsObject
  }

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
          {topArtistsQuery.isLoading && (
            <div>
              <Spinner />
            </div>
          )}

          {topArtistsQuery.isSuccess && (
            <Container fluid>
              <Row className="justify-content-center mb-5">
                <Col xs={12} md={9} lg={6} xl={4}>
                  {!!genreChartData && !!topArtists && (
                    <GenrePieChart genreChartData={genreChartData} topArtists={topArtists} />
                  )}
                </Col>
              </Row>
            </Container>
          )}
        </>
      )}
    </main>
  )
}
