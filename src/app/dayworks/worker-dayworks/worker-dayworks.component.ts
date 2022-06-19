import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class WorkerDayworksComponent implements OnInit, OnChanges {
  @Input() dayworks!: Daywork[]
  @Input() dateRange!: DateRange
  @Input() worker!: Worker
  totalDayworks = 0

  constructor(private workerRepo: WorkerRepositoryService) { }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes['dayworks'])
    const dayworksChanges = changes['dayworks']
    if (dayworksChanges.currentValue) {
      this.calculateTotalDayworksInRange()
    }
  }


  ngOnInit(): void {
    this.setDayworks()
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

  private setDayworks() {
    this.fillUpDayworksArrayIfRequired()

    this.dayworks?.forEach((dw, dayIndex) => {
      if (!dw.isDefined && this.worker.autoTracking) {
        this.setDayworkByAutotracker(dayIndex)
      }
    })
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
      this.dayworks.push(new Daywork())
    }
  }

  private allDayworksAreInitialized(): boolean {
    return this.dayworks?.length === (DAYS_IN_DATE_RANGE + 1)
  }

  calculateTotalDayworksInRange() {
    this.totalDayworks = 0
    this.dayworks?.forEach(dw => {
      if (dw.status === true) this.totalDayworks++
    })
  }

}