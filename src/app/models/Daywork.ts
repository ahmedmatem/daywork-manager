export class Daywork {
  status: boolean = false // - true if worker is working on this day otherwise is false
  isDefined: boolean = false
  day!: number
  diffHours: number = 0

  constructor() { }
}
