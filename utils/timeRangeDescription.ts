import { TimeRangeType } from './../types/index'

export const timeRangeDescription = (timeRange: TimeRangeType) => {
  if (timeRange === 'long_term') return '(All Time)'
  if (timeRange === 'medium_term') return '(Last 6 Months)'
  if (timeRange === 'short_term') return '(Last Month)'
}
