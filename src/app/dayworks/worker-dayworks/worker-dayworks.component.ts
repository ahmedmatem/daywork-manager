import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core'
import { ModalDismissReasons, NgbModal, NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'
import { DAYS_IN_DATE_RANGE, DAYWORK_DURATION_IN_HOURS } from '../../app.config'
import { WorkerRepositoryService } from '../../data/worker-repository.service'
import { DateRange } from '../../models/DateRange'
import { Daywork } from '../../models/Daywork'
import { Role } from '../../models/Role'
import { Worker } from '../../models/Worker'
import { NumberPickerService } from '../../share/number-picker/number-picker.service'
import { DayworksService } from '../dayworks.service'

const DOUBLE_CLICK_GAP = 250

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
  @Input() role!: string

  @ViewChildren('popOver') popovers!: QueryList<NgbPopover>

  totalDays = 0
  hours = 0
  selectedDate!: Date
  today = new Date()

  partTimeHourPickerText!: string
  dayPayPickerText!: string
  dayPayDefaultValue: number = 150
  paymentAfterTax!: number

  modalCloseResult = ''

  private _isSingleClick = true
  private _currentDayIndex = 0

  private onDayworksChangedSubscription: Subscription = new Subscription
  private onPartTimeHourPickedSubscription: Subscription = new Subscription
  private onPartTimeHourChangedSubscription: Subscription = new Subscription
  private onDaypayChangedSubscription: Subscription = new Subscription

  constructor(
    private workerRepo: WorkerRepositoryService,
    private dayworksService: DayworksService,
    ngbPopoverConfig: NgbPopoverConfig,
    ngbPopover: NgbPopover,
    private numberPickerService: NumberPickerService,
    private modalService: NgbModal) {

    ngbPopoverConfig.container = 'body'
    ngbPopoverConfig.autoClose = 'outside'
  }

  ngOnInit(): void {
    this.setDayworks()
    //this.workerRepo.workersDayworksFromRemoteDb(this.dateRange)
    //this.workerRepo.getDayworks(this.dateRange, this.worker.id)
    this.requestDayworksByRole(this.role)

    this.onDayworksChangedSubscription =
      this.workerRepo.onDayworksChanged.subscribe(wd => {
        this.dayworks = wd[this.worker.id]
        this.setDayworks()
      })

    this.onPartTimeHourPickedSubscription =
      this.numberPickerService.onNumberPicked.subscribe(diffHours => {
        this.closePopover()
        this.toogleDaywork(this._currentDayIndex, diffHours, false)
      })

    this.onPartTimeHourChangedSubscription =
      this.numberPickerService.onNumberChanged.subscribe(hours => {
        this.partTimeHourPickerText = `Set ${hours} hour` +
          ((hours > 1 || hours < -1) ? 's' : '')
      })

    this.onDaypayChangedSubscription =
      this.numberPickerService.onNumberChanged.subscribe(dayPay => {
        this.dayPayPickerText = `??${dayPay}`
        this.paymentAfterTax =
          this.dayworksService.paymentAfterTax(
            this.totalDays,
            this.hours,
            dayPay
          )
      })
  }

  openModal(content: any) {
    // Initialize picker text
    this.dayPayPickerText = `??${this.dayPayDefaultValue}`
    this.paymentAfterTax =
      this.dayworksService.paymentAfterTax(
        this.totalDays,
        this.hours,
        this.dayPayDefaultValue
      )
    
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.modalCloseResult = `Closed with: ${result}`
    }, (reason) => {
      this.modalCloseResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  onDayworkClick(dayIndex: number) {
    this._isSingleClick = true
    this._currentDayIndex = dayIndex
    setTimeout(() => {
      if (this._isSingleClick) {
        // Handle single click
        this.toogleDaywork(dayIndex)
      }
    }, DOUBLE_CLICK_GAP)
  }

  onDayworkDoubleClick(dayIndex: number) {
    this._isSingleClick = false
    this._currentDayIndex = dayIndex
    // Handle double click
    const day = this.dayworks[dayIndex].day
    this.selectedDate = this.dateFromDayworkDay(day)
    this.partTimeHourPickerText = 'Set hours'
  }

  onPopoverClose() {
    this.closePopover()
  }

  ngOnDestroy(): void {
    if (this.onDayworksChangedSubscription) {
      this.onDayworksChangedSubscription.unsubscribe()
    }
    if (this.onPartTimeHourPickedSubscription) {
      this.onPartTimeHourPickedSubscription.unsubscribe()
    }
    if (this.onPartTimeHourChangedSubscription) {
      this.onPartTimeHourChangedSubscription.unsubscribe()
    }
    if (this.onDaypayChangedSubscription) {
      this.onDaypayChangedSubscription.unsubscribe()
    }
  }

  //private toogleDaywork(dayIndex: number) {
  //  this.updateDaywork(dayIndex)
  //}

  private toogleDaywork(
    dayIndex: number,
    diffHours: number = 0,
    toogle: boolean = true
  ) {
    const dw = new Daywork()
    dw.day = this.dayworks[dayIndex].day
    dw.isDefined = true
    dw.diffHours = diffHours
    if (toogle) {
      dw.status = !this.dayworks[dayIndex].status
    } else {      
      dw.status = true
    }

    this.dayworks[dayIndex] = dw
    this.calculateTotalDayworksInRange()
    this.workerRepo.saveDayworks(
      this.worker.id,
      this.dateRange,
      { workerId: this.worker.id, dayworks: this.dayworks }
    )
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
    const dw = new Daywork()
    dw.day = this.dateRange.days()[dayIndex]
    dw.isDefined = true
    dw.status = this.worker.trackingDays[dayIndex % 7].tracked
    this.dayworks[dayIndex] = dw
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

  private calculateTotalDayworksInRange() {
    this.totalDays = 0
    this.hours = 0
    this.dayworks?.forEach(dw => {
      if (dw.status === true) {
        this.hours += dw.diffHours === undefined ? 0 : dw.diffHours
        this.totalDays++
      }
    })
  }

  private closePopover() {
    this.popovers.forEach(pop => {
      if (pop.isOpen()) {
        pop.close()
      }
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC'
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop'
    } else {
      return `with: ${reason}`
    }
  }

  private requestDayworksByRole(role: string) {
    switch (role) {
      case Role.User:
        this.workerRepo.getDayworks(this.dateRange, this.worker.id)
        break
      case Role.Manager:
      case Role.Admin:
        this.workerRepo.getDayworks(this.dateRange)
        break
    }
  }
}
