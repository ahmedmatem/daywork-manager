export class DayTracker {
  day: string
  tracked: boolean

  constructor(_day: string, _tracked: boolean = true) {
    this.day = _day
    this.tracked = _tracked
  }

}
