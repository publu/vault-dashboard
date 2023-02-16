import { nextSunday, previousSunday } from "date-fns/fp";

export function setTo5PMUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0, 0, 0)
  );
}

export function generatePeriodTimestamps(date: Date): {
  startOfPreviousPeriod: Date;
  startOfCurrentPeriod: Date;
  endOfCurrentPeriod: Date;
  endOfNextPeriod: Date;
} {
  const currentDateAt5PmUtc = setTo5PMUTC(date);
  const startOfCurrentPeriod = previousSunday(currentDateAt5PmUtc);
  const startOfPreviousPeriod = previousSunday(startOfCurrentPeriod);
  const endOfCurrentPeriod = nextSunday(currentDateAt5PmUtc);
  const endOfNextPeriod = nextSunday(endOfCurrentPeriod);
  return {
    startOfPreviousPeriod,
    startOfCurrentPeriod,
    endOfCurrentPeriod,
    endOfNextPeriod,
  };
}
