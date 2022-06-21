declare global {
  interface Date {
    before(date: Date): boolean
    after(date: Date): boolean
    between(date1: Date, date2: Date): boolean
  }

  interface DateConstructor {
    
  }
}

/**
 * 
 * @param month - expected value range: 0..11 (0 for january)
 * @returns the last day of month
 */
export const getLastDayOfMonth = (month: number): number => {
  if (month < 0 || 11 < month) {
    throw `getLastDayOfMonth(month(${month})): argument must be between 0 and 11.`
  }
  return new Date(2022, month + 1, 0).getDate()
}

Date.prototype.before = function (this: Date, date: Date) {
  return this.getTime() < date.getTime()
}

Date.prototype.after = function (this: Date, date: Date) {
  return this.getTime() > date.getTime()
}

Date.prototype.between = function (this: Date, date1: Date, date2: Date) {
  if (date1.before(date2)) {
    return date1.getTime() < this.getTime() && this.getTime() < date2.getTime()
  }
  return date2.getTime() < this.getTime() && this.getTime() < date1.getTime()
}

export { }
