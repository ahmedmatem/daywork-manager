import { DayTracker } from "./DayTracker"
import { WeekDay } from "./WeekDay"

export class Worker {
  id!: string
  name: string
  autoTracking: boolean = true
  registeredOn: Date = new Date()
  registeredOnInMillis: number = this.registeredOn.getTime()
  trackingDays: DayTracker[] = [
    // default tracking days
    new DayTracker(WeekDay.Monday, true),
    new DayTracker(WeekDay.Tuesday, true),
    new DayTracker(WeekDay.Wednesday, true),
    new DayTracker(WeekDay.Thursday, true),
    new DayTracker(WeekDay.Friday, true),
    new DayTracker(WeekDay.Saturday, false),
    new DayTracker(WeekDay.Sunday, false),
  ]

  /**
   * Use this property to keep an eye of worker remote synchronization
   *
   * This property must be always FALSE on the server.
   * 
   * All worker changes are save in local storage. Also they shoud be
   * uploaded into remote server however this could be fail due to lack of
   * internet connection for example. In such cases this property must be set
   * with TRUE value to indicate explicite further update posibility.
   * */
  isSyncRequired: boolean = false

  constructor(_name?: string) {
    this.name = _name!
  }

  //payload() {
  //  return {
  //    name: this.name,
  //    registeredOn: this.registeredOn.getTime(),
  //    trackingDays: this.trackingDays.map(td => td.tracked),
  //    autoTracking: this.autoTracking
  //  }
  //}

  //fromData(data: {
  //  id: string,
  //  name: string,
  //  registeredOn:
  //  number,
  //  trackingDays: boolean[],
  //  autoTracking: boolean
  //}): Worker {
  //  this.name = data.name
  //  this.registeredOn = new Date(data.registeredOn)
  //  this.trackingDays = [
  //    // default tracking days
  //    new DayTracker(WeekDay.Monday, data.trackingDays[0]),
  //    new DayTracker(WeekDay.Tuesday, data.trackingDays[1]),
  //    new DayTracker(WeekDay.Wednesday, data.trackingDays[2]),
  //    new DayTracker(WeekDay.Thursday, data.trackingDays[3]),
  //    new DayTracker(WeekDay.Friday, data.trackingDays[4]),
  //    new DayTracker(WeekDay.Saturday, data.trackingDays[5]),
  //    new DayTracker(WeekDay.Sunday, data.trackingDays[6]),
  //  ]
  //  this.autoTracking = data.autoTracking
  //  return this
  //}

  //resetRegistrationDate(millis: number) {
  //  this.registeredOn = new Date(millis)
  //}
}
