import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DAYS_IN_DATE_RANGE } from '../../app.config';
import { WorkerRepositoryService } from '../../data/worker-repository.service';
import { DateRange } from '../../models/DateRange';
import { Daywork } from '../../models/Daywork';
import { Worker } from '../../models/Worker';
import { NumberPickerService } from '../../share/number-picker/number-picker.service';

@Component({
  selector: 'app-worker-dayworks',
  templateUrl: './worker-dayworks.component.html',
  styleUrls: ['./worker-dayworks.component.css'],
  providers: [NgbPopover]
})
export class WorkerDayworksComponent implements OnInit, OnDestroy {
  @Input() dayworks!: Daywork[]
  @Input() dateRange!: DateRange
  @Input() worker!: Worker

  @ViewChildren('popOver') popovers!: QueryList<NgbPopover>

  totalDayworks = 0
  selectedDate!: Date

  private isSingleClick = true

  private onDayworksChangedSubscription: Subscription = new Subscription
  private onNumberPickedSubscription: Subscription = new Subscription

  constructor(
    private workerRepo: WorkerRepositoryService,
    private ngbPopoverConfig: NgbPopoverConfig,
    private ngbPopover: NgbPopover,
    private numberPickerService: NumberPickerService) {
    ngbPopoverConfig.container = 'body'
    ngbPopoverConfig.autoClose = 'outside'
  }

  ngOnInit(): void {
    this.setDayworks()
    this.workerRepo.workersDayworksFromRemoteDb(this.dateRange)

    this.onDayworksChangedSubscription =
      this.workerRepo.onDayworksChanged.subscribe(wd => {
        this.dayworks = wd[this.worker.id]
        this.setDayworks()
      })

    this.onNumberPickedSubscription =
      this.numberPickerService.onNumberPicked.subscribe(n => {
        this.popovers.forEach(pop => {
          if (pop.isOpen()) {
            pop.close()
          }
        })
      })
  }

  onDayworkClick(dayIndex: number) {
    this.isSingleClick = true
    setTimeout(() => {
      if (this.isSingleClick) {
        // Handle single click
        this.toogleDaywork(dayIndex)
      }
    }, 250)
  }

  onDayworkDoubleClick(dayIndex: number) {
    this.isSingleClick = false
    // Handle double click
    const day = this.dayworks[dayIndex].day
    this.selectedDate = this.dateFromDayworkDay(day)
  }

  ngOnDestroy(): void {
    if (this.onDayworksChangedSubscription) {
      this.onDayworksChangedSubscription.unsubscribe()
    }
    if (this.onNumberPickedSubscription) {
      this.onNumberPickedSubscription.unsubscribe()
    }
  }

  private toogleDaywork(dayIndex: number) {
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

  //private allDayworksAreInitialized(): boolean {
  //  return this.dayworks?.length === (DAYS_IN_DATE_RANGE + 1)
  //}

  private calculateTotalDayworksInRange() {
    this.totalDayworks = 0
    this.dayworks?.forEach(dw => {
      if (dw.status === true) this.totalDayworks++
    })
  }

}
