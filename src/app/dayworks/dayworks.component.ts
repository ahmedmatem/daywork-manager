import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Subject, Subscription, take } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { User } from '../auth/user.model'
import { WorkerRepositoryService } from '../data/worker-repository.service'

import { DateRange } from '../models/DateRange'
import { Daywork } from '../models/Daywork'
import { Role } from '../models/Role'
import { Worker } from '../models/Worker'
import { IDictionary } from '../share/utils'

@Component({
  selector: 'app-daywork-list',
  templateUrl: './dayworks.component.html',
  styleUrls: ['./dayworks.component.css']
})
export class DayworksComponent implements OnInit, OnDestroy {
  user: User | null = null
  dateRange = new DateRange()
  workers: Worker[] | undefined
  //dayworks: { workerId: string, dayworks: Daywork[] }[] = []
  workersDayworks = {} as IDictionary<Daywork[]>
  role!: string

  onWorkersChangedSub = new Subscription

  isLoading = false

  constructor(
    private workerRepo: WorkerRepositoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user.getValue()
    this.role = this.user?.role!

    this.workers = []

    this.isLoading = true

    switch (this.user?.role) {
      case Role.User:
        this.workerRepo.fetchWorker(this.user.id)
        break
      case Role.Manager:
      case Role.Admin:
        this.workerRepo.fetchWorkers()
        break
      default:
    }

    this.onWorkersChangedSub =
      this.workerRepo.onWorkersChanged.subscribe(
        workers => {
          this.isLoading = false
          this.workers = workers
        }
      )
  }

  ngOnDestroy(): void {
    this.onWorkersChangedSub?.unsubscribe()
  }

  onPrevDateRange() {
    this.dateRange.setPrev()
    // Reload dayworks for new dateRange
    //this.workerRepo.workersDayworksFromRemoteDb(this.dateRange)
    //this.workerRepo.getWorkerDayworks(this.user?.id!, this.dateRange)
    this.requestDayworksByRole(this.user?.role!)
  }

  onNextDateRange() {
    this.dateRange.setNext()
    // Reload dayworks for new dateRange
    //this.workerRepo.workersDayworksFromRemoteDb(this.dateRange)
    //this.workerRepo.getDayworks(this.dateRange, this.user?.id)
    this.requestDayworksByRole(this.user?.role!)
  }

  hasNextDateRange(): boolean {
    const today = new Date()
    return this.dateRange.startDate.getTime() < today.getTime()
  }

  private requestDayworksByRole(role: string) {
    switch (role) {
      case Role.User:
        this.workerRepo.getDayworks(this.dateRange, this.user?.id)
        break
      case Role.Manager:
      case Role.Admin:
        this.workerRepo.getDayworks(this.dateRange)
        break
    }
  }
}
