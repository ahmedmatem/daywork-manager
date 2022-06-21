import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DAYS_IN_DATE_RANGE } from '../../app.config';
import { WorkerRepositoryService } from '../../data/worker-repository.service';
import { DateRange } from '../../models/DateRange';
import { Daywork } from '../../models/Daywork';
import { Worker } from '../../models/Worker';

@Component({
  selector: 'app-worker-dayworks',
  templateUrl: './worker-dayworks.component.html',
  styleUrls: ['./worker-dayworks.component.css']
})
export class WorkerDayworksComponent implements OnInit, OnDestroy {
  @Input() dayworks!: Daywork[]
  @Input() dateRange!: DateRange
  @Input() worker!: Worker
  totalDayworks = 0

  dayworksChangedSubscription: Subscription = new Subscription

  constructor(private workerRepo: WorkerRepositoryService) { }


  ngOnInit(): void {
    this.setDayworks()

    this.dayworksChangedSubscription = this.workerRepo.onDayworksChanged.subscribe(wd => {
      this.dayworks = wd[this.worker.id]
      this.setDayworks()
    })
  }

  toogleDaywork(dayIndex: number) {
    this.dayworks[dayIndex] = {
      day: this.dayworks[dayIndex].day,
      isDefined: true,
      status: !this.dayworks[dayIndex].status
    }
    this.calculateTotalDayworksInRange()
    this.workerRepo.saveDayworks(this.dateRange, { workerId: this.worker.id, dayworks: this.dayworks })
  }

  ngOnDestroy(): void {
    this.dayworksChangedSubscription.unsubscribe()
  }

  private setDayworks() {
    this.fillUpDayworksArrayIfRequired()

    const today = new Date()
    this.dayworks?.forEach((dw, dayIndex) => {
      // Return if current date is after today
      const date = this.dateFromDayworkDay(dw.day)
      if (date.after(today)) {
        return
      }

      if (!dw.isDefined && this.worker.autoTracking) {
        this.setDayworkByAutotracker(dayIndex)
      }
    })

    this.calculateTotalDayworksInRange()
  }

  private dateFromDayworkDay(day: number): Date {
    let year = this.dateRange.startDate.getFullYear()
    let month = this.dateRange.startDate.getMonth()

    const firstDayOfMonthInRange = this.dateRange.startDate.getDate()
    if (day < firstDayOfMonthInRange) {
      year = this.dateRange.endDate.getFullYear()
      month = this.dateRange.endDate.getMonth()
    }
    
    return new Date(year, month, day)
  }

  private setDayworkByAutotracker(dayIndex: number) {
    this.dayworks[dayIndex] = {
      day: this.dateRange.days()[dayIndex],
      isDefined: true,
      status: this.worker.trackingDays[dayIndex % 7].tracked
    }
  }

  private fillUpDayworksArrayIfRequired() {
    if (!this.dayworks) this.dayworks = []

    const length = this.dayworks?.length
    for (let i = length; i <= DAYS_IN_DATE_RANGE; i++) {
      const newDaywork = new Daywork()
      newDaywork.day = this.dateRange.days()[i]
      this.dayworks.push(newDaywork)
    }
  }

  private allDayworksAreInitialized(): boolean {
    return this.dayworks?.length === (DAYS_IN_DATE_RANGE + 1)
  }

  private calculateTotalDayworksInRange() {
    this.totalDayworks = 0
    this.dayworks?.forEach(dw => {
      if (dw.status === true) this.totalDayworks++
    })
  }

}
