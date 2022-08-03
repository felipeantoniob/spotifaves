import { ButtonGroup, ToggleButton } from 'react-bootstrap'

export type TimeRangeType = 'long_term' | 'medium_term' | 'short_term'

type TimeRangeRadioProps = {
  timeRange: TimeRangeType
  setTimeRange: React.Dispatch<React.SetStateAction<TimeRangeType>>
}

const TimeRangeRadio = ({ timeRange, setTimeRange }: TimeRangeRadioProps): JSX.Element => {
  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setTimeRange(e.currentTarget.value as 'long_term' | 'medium_term' | 'short_term')
  }
  return (
    <ButtonGroup aria-label="Time range buttons" className="ms-auto">
      <ToggleButton
        id="long-term-btn"
        type="radio"
        name="timerange-radio"
        value="long_term"
        checked={timeRange === 'long_term'}
        onChange={changeHandler}
        className="btn-timerange"
      >
        All Time
      </ToggleButton>
      <ToggleButton
        id="medium-term-btn"
        type="radio"
        name="timerange-radio"
        value="medium_term"
        checked={timeRange === 'medium_term'}
        onChange={changeHandler}
        className="btn-timerange"
      >
        Last 6 Months
      </ToggleButton>
      <ToggleButton
        id="short-term-btn"
        type="radio"
        name="timerange-radio"
        value="short_term"
        checked={timeRange === 'short_term'}
        onChange={changeHandler}
        className="btn-timerange"
      >
        This Month
      </ToggleButton>
    </ButtonGroup>
  )
}

export default TimeRangeRadio
