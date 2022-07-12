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

  onWorkersChangedSub = new Subscription

  isLoading = false

  constructor(
    private workerRepo: WorkerRepositoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user.getValue()

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
      this.workerRepo.onFetchWorkers.subscribe(
        workers => {
          this.isLoading = false
          this.workers = workers
          //workers?.forEach(w => {
          //  console.log(`WorkerId: ${w.id}; for date range: ${this.dateRange}`)
          //  this.workerRepo.getWorkerDayworks(w.id, this.dateRange)
          //})
        }
      )
  }

  ngOnDestroy(): void {
    this.onWorkersChangedSub.unsubscribe()
  }

  onPrevDateRange() {
    this.dateRange.setPrev()
    // Reload dayworks for new dateRange
    this.workerRepo.workersDayworksFromRemoteDb(this.dateRange)
  }

  onNextDateRange() {
    this.dateRange.setNext()
    // Reload dayworks for new dateRange
    this.workerRepo.workersDayworksFromRemoteDb(this.dateRange)
  }

  hasNextDateRange(): boolean {
    const today = new Date()
    return this.dateRange.startDate.getTime() < today.getTime()
  }

  //getWorkerDayworks(worker: Worker): Daywork[] | undefined {
  //  return this.workersDayworks[worker.id]
  //  //return this.dayworks.find(d => d.workerId === worker.id)?.dayworks
  //}
}
