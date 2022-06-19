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

