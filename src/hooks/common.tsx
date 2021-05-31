import { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

/**
 *
 * @returns the number of milliseconds until the next hour
 */
const timeUntillNextHour = (): number => {
  const now = new Date()
  const nextHour = now.getHours() + 1
  const next = new Date()
  next.setHours(nextHour, 0, 0, 0)

  return next.getTime() - now.getTime()
}

/**
 * This hooks will continuously return the current hour of the day.
 * @returns The hour of the day (0-23).
 */
export const useHour = (): number => {
  const [hour, setHour] = useState(DateTime.local().hour)

  useEffect(() => {
    // Every time hour changes set a timer to update the hour at the next hour
    let tId: NodeJS.Timeout
    if (hour) {
      // Cacl how long until the next hour
      const wait = timeUntillNextHour() + 250 // Adding 1/4 of second for saftey
      // For testing
      console.log(
        'Hour will update at ' + new Date(new Date().getTime() + wait),
      )
      // set a timeout to update the time when the next hour arrives
      tId = setTimeout(() => {
        setHour(DateTime.local().hour)
      }, wait)
    }
    // Clean up timer
    return () => clearTimeout(tId)
  }, [hour])

  return hour
}
