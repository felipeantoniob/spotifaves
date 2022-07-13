import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'
// import { Doughnut } from 'react-chartjs-2'

import { getGenresArtists } from '../utils/getGenresArtists'

interface GenreArtistObjectProps {
  genre: string
  artists: string[]
}
interface GenrePieChartProps {
  genreChartData: GenreArtistObjectProps[]
  topArtists: SpotifyApi.ArtistObjectFull[]
}

const backgroundColorArray = [
  '#3cb44b99',
  '#e6194b99',
  '#ffe11999',
  '#4363d899',
  '#f5823199',
  '#911eb499',
  '#46f0f099',
  '#f032e699',
  '#bcf60c99',
  '#fabebe99',
  '#00808099',
  '#e6beff99',
  '#9a632499',
  '#fffac899',
  '#80000099',
  '#aaffc399',
  '#80800099',
  '#ffd8b199',
  '#00007599',
  '#80808099',
]
const borderColorArray = [
  '#3cb44b11',
  '#e6194b11',
  '#ffe11911',
  '#4363d811',
  '#f5823111',
  '#911eb411',
  '#46f0f011',
  '#f032e611',
  '#bcf60c11',
  '#fabebe11',
  '#00808011',
  '#e6beff11',
  '#9a632411',
  '#fffac811',
  '#80000011',
  '#aaffc311',
  '#80800011',
  '#ffd8b111',
  '#00007511',
  '#80808011',
]

ChartJS.register(ArcElement, Tooltip, Legend)

const GenrePieChart = ({ genreChartData, topArtists }: GenrePieChartProps) => {
  const data = {
    labels: genreChartData.map((genre) => genre.genre),
    datasets: [
      {
        label: 'Top Genres',
        data: genreChartData.map((genre) => genre.artists.length),
        backgroundColor: backgroundColorArray,
        borderColor: borderColorArray,
        borderWidth: 1,
      },
    ],
  }
  return (
    <div>
      <div>
        <Pie
          data={data}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  boxWidth: 20,
                  color: 'rgba(255, 255, 255, 0.6)',
                  font: {
                    size: 16,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.label}: ${getGenresArtists(topArtists!, context.label).join(
                      ', '
                    )}`
                  },
                },
                bodyFont: { size: 12 },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default GenrePieChart
