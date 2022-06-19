import { DAYS_IN_DATE_RANGE, PAYDAY_ANCHOR } from 'src/app/app.config'
import { getLastDayOfMonth } from '../share/date-helpers'


export class DateRange {
  startDate!: Date
  endDate!: Date

  constructor() {
    this.initRange()
  }

  setNext() {
    const oldEndDateCopy = new Date(this.endDate.getTime())
    this.startDate = new Date(oldEndDateCopy.setDate(oldEndDateCopy.getDate() + 1))
    this.endDate = this.getEndDateBy(this.startDate)
  }

  setPrev() {
    const oldStartDateCopy = new Date(this.startDate.getTime())
    this.startDate = new Date(oldStartDateCopy.setDate(oldStartDateCopy.getDate() - DAYS_IN_DATE_RANGE - 1))
    this.endDate = this.getEndDateBy(this.startDate)
  }

  days(): number[]{
    const firstDay = this.startDate.getDate()
    const lastDay = this.endDate.getDate()
    const isRangeLayOnTwoMonths = firstDay > lastDay
    let lastDayOfMonth = 32
    if (isRangeLayOnTwoMonths) {
      const firstMonth = this.startDate.getMonth()
      try {
        lastDayOfMonth = getLastDayOfMonth(firstMonth)
      } catch (err) {
        console.log(err)
      }
    }

    return new Array(DAYS_IN_DATE_RANGE + 1).fill(firstDay).map((value, index) => {
      let day = value + index
      if (day > lastDayOfMonth) {
        return day - lastDayOfMonth
      } else {
        return value + index
      }
    })
  }

  private initRange() {
    const today = new Date()
    this.startDate = this.getStartDateForRangeContains(today)
    this.endDate = this.getEndDateBy(this.startDate)
  }

  private getStartDateForRangeContains(date: Date): Date {
    const dayOfWeek = date.getDay() /*return 0..6 (0 for Sunday)*/
    const offsetInDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const lastMondayAsNumber = date.setDate(date.getDate() - offsetInDays)

    if (this.isMondayInFirstWeek(lastMondayAsNumber)) {
      return new Date(lastMondayAsNumber)
    }
    else {
      const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000
      const prevMondayAsNumber = lastMondayAsNumber - sevenDaysInMillis
      return new Date(prevMondayAsNumber)
    }
  }

  /**
   * This function calculates if mondayAsNumber(Monday) belongs to first week
   * in the range of two weeks depends on the PAYDAY_ANCHOR(Friday).
   * @param mondayAsNumber
   * @returns - true if Monday belongs to first week of the range, false - otherwise.
   */
  private isMondayInFirstWeek(mondayAsNumber: number) {
    // Three days is the distance from Friday to Monday
    const THREE_DAYS_IN_MILLIS = 3 * 24 * 60 * 60 * 1000
    const dayInMillis = 24 * 60 * 60 * 1000
    const daysInDateRange = DAYS_IN_DATE_RANGE + 1
    const oneDay = 1
    const mondayOffsetFromPaydayAnchorInMillis =
      mondayAsNumber - PAYDAY_ANCHOR.getTime() - THREE_DAYS_IN_MILLIS
    return (Math.abs((mondayOffsetFromPaydayAnchorInMillis / dayInMillis)) % daysInDateRange) < oneDay
  }

  private getEndDateBy(startDate: Date) {
    const clonedStartDate = new Date(startDate.getTime())
    return new Date(clonedStartDate.setDate(clonedStartDate.getDate() + DAYS_IN_DATE_RANGE))
  }
}

DateRange.prototype.toString = function () {
  const startDateFormated = `${this.startDate.getFullYear()}-${this.startDate.getMonth()+1}-${this.startDate.getDate()}`
  const endDateFormated = `${this.endDate.getFullYear()}-${this.endDate.getMonth()+1}-${this.endDate.getDate()}`

  return `${startDateFormated}-${endDateFormated}`
}
