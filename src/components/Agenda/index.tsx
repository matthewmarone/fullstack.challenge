import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DateTime } from 'luxon'

import greeting from 'lib/greeting'

import Calendar from 'src/models/Calendar'
import Event from 'src/models/Event'
import AccountContext from 'src/context/accountContext'

import List from './List'
import EventCell from './EventCell'

import style from './style.scss'
import { useHour } from '../../hooks'

type AgendaItem = {
  calendar: Calendar
  event: Event
}

type Props = {
  globalMessage?: string
}

const compareByDateTime = (a: AgendaItem, b: AgendaItem) =>
  a.event.date.diff(b.event.date).valueOf()

/**
 * Agenda component
 * Displays greeting (depending on time of day)
 * and list of calendar events
 */

const Agenda = (props: Props): ReactElement => {
  const account = useContext(AccountContext)
  const hour = useHour() // Dynamically return the hour of the day (0-23)
  const { globalMessage } = props
  const [selectedCal, setSelectedCal] = useState<string>('')

  const handelCalendarChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedCal(e.target.value)
    },
    [],
  )

  useEffect(() => {
    // Deselect calendar when account changes
    if (account) setSelectedCal('')
  }, [account])

  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .reduce((pv, cv) => {
          if (!selectedCal) {
            pv[pv.length] = cv
          } else if (cv.id == selectedCal) {
            pv[pv.length] = cv
          }
          return pv
        }, [])
        .flatMap((calendar: Calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime),
    [account.calendars, selectedCal],
  )

  // const title = useMemo(() => greeting(DateTime.local().hour), [])
  const title = greeting(hour)

  return (
    <div className={style.outer}>
      <div
        className={!globalMessage ? style.hiddenElement : style.errorMessage}
      >
        {globalMessage}
      </div>
      <div className={style.container}>
        <div className={style.header}>
          <span className={style.title}>{title}</span>
        </div>
        <div className={style.filterWrapper}>
          <div className={style.filterItemCenter}>
            <label htmlFor="calendar">Calendar:</label>
            <select
              name="calendar"
              value={selectedCal}
              onChange={handelCalendarChange}
            >
              <option value="">All Calendars</option>
              {account.calendars.map((c, i) => (
                <option key={c.id} value={c.id}>
                  {`Calendar ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
          <div className={style.filterItemRight}>
            Group by Department:
            <input type="checkbox" />
          </div>
        </div>
        <List>
          {events.map(({ calendar, event }) => (
            <EventCell key={event.id} calendar={calendar} event={event} />
          ))}
        </List>
      </div>
    </div>
  )
}

export default Agenda
