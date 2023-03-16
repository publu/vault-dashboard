import { add, set, startOfWeek } from 'date-fns'
import { getUnixTime, nextSunday, previousSunday } from 'date-fns/fp'

export function setTo5PMUTC(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0, 0, 0))
}

function* generateSundays(date: Date, direction: 'previous' | 'next'): Generator<Date> {
    let sunday = startOfWeek(date, { weekStartsOn: 0 })

    while (true) {
        yield sunday

        if (direction === 'previous') {
            sunday = set(sunday, { hours: 17 })
            sunday = add(sunday, { days: -7 })
        } else {
            sunday = set(sunday, { hours: 17 })
            sunday = add(sunday, { days: 7 })
        }
    }
}

export function generatePeriodTimestamps(date: Date): {
    startOfPreviousPeriod: Date
    startOfCurrentPeriod: Date
    endOfCurrentPeriod: Date
    endOfNextPeriod: Date
} {
    const currentDateAt5PmUtc = setTo5PMUTC(date)
    console.log('currentDateAt5PmUtc', currentDateAt5PmUtc)
    console.log('currentDateAt5PmUtc', getUnixTime(currentDateAt5PmUtc))
    const startOfCurrentPeriod = previousSunday(currentDateAt5PmUtc)
    const startOfPreviousPeriod = previousSunday(startOfCurrentPeriod)
    const endOfCurrentPeriod = nextSunday(currentDateAt5PmUtc)
    const endOfNextPeriod = nextSunday(endOfCurrentPeriod)
    return {
        startOfPreviousPeriod,
        startOfCurrentPeriod,
        endOfCurrentPeriod,
        endOfNextPeriod,
    }
}
