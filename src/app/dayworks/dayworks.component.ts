import { Component, OnInit } from '@angular/core'
import { WorkerRepositoryService } from '../data/worker-repository.service'

import { DateRange } from '../models/DateRange'
import { Daywork } from '../models/Daywork'
import { Worker } from '../models/Worker'
import { IDictionary } from '../share/utils'

@Component({
  selector: 'app-daywork-list',
  templateUrl: './dayworks.component.html',
  styleUrls: ['./dayworks.component.css']
})
export class DayworksComponent implements OnInit {
  dateRange = new DateRange()
  workers: Worker[] | undefined
  dayworks: { workerId: string, dayworks: Daywork[] }[] = []
  workersDayworks = {} as IDictionary<Daywork[]>

  constructor(private workerRepo: WorkerRepositoryService) { }

  ngOnInit(): void {
    this.workerRepo.onDayworksDownloaded.subscribe(dayworks => {
      this.workersDayworks = dayworks
      })
    this.workerRepo.onWorkersChanged.subscribe(workers => {
        this.workers = workers
      })

    this.workers = this.workerRepo.getWorkers()
    this.workerRepo.getDayworksRS(this.dateRange)
  }

  onPrevDateRange() {
    this.dateRange.setPrev()
    // Reload dayworks for new dateRange
    this.workerRepo.getDayworksRS(this.dateRange)
  }

  onNextDateRange() {
    this.dateRange.setNext()
    // Reload dayworks for new dateRange
    this.workerRepo.getDayworksRS(this.dateRange)
  }

  hasNextDateRange(): boolean {
    const today = new Date()
    return this.dateRange.startDate.getTime() < today.getTime()
  }

  getWorkerDayworks(worker: Worker): Daywork[] | undefined {
    return this.dayworks.find(d => d.workerId === worker.id)?.dayworks
  }
}
