import React, { ReactElement, useContext, useMemo } from 'react'
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

  const events: AgendaItem[] = useMemo(
    () =>
      account.calendars
        .flatMap((calendar) =>
          calendar.events.map((event) => ({ calendar, event })),
        )
        .sort(compareByDateTime),
    [account],
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
