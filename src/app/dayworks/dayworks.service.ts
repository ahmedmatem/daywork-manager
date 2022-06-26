import { Injectable } from '@angular/core'
import { DAYWORK_DURATION_IN_HOURS } from '../app.config'
import { DateRange } from '../models/DateRange'
import { Daywork } from '../models/Daywork'

@Injectable({
  providedIn: 'root'
})
export class DayworksService {
  //dateRange!: DateRange
  //workersDayworkList: { workerName: string, dayworkList: Daywork[] }[] = []

  constructor() {
  }

  paymentAfterTax(
    days: number,
    hours: number,
    daypay: number
  ): number {
    const paymentPerHour = daypay / DAYWORK_DURATION_IN_HOURS
    let amount = days * daypay + hours * paymentPerHour
    return amount * 0.8
  }
}
