import { Injectable } from '@angular/core'
import { DateRange } from '../models/DateRange'
import { Daywork } from '../models/Daywork'

@Injectable({
  providedIn: 'root'
})
export class DayworksService {
  dateRange!: DateRange
  workersDayworkList: { workerName: string, dayworkList: Daywork[] }[] = []

  constructor() {
  }
}
