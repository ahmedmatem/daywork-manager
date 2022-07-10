import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { Worker } from '../../models/Worker'
import { WorkerRepositoryService } from '../../data/worker-repository.service'

@Component({
  selector: 'app-worker-detail',
  templateUrl: './worker-detail.component.html',
  styleUrls: ['./worker-detail.component.css']
})
export class WorkerDetailComponent implements OnInit {
  @Input() worker!: Worker
  @Input() autoTracking!: boolean
  isSyncFail: boolean = false

  constructor(
    private route: ActivatedRoute,
    private workerRepository: WorkerRepositoryService) { }

  ngOnInit(): void {
    this.workerRepository.onSyncFail.subscribe(() => {
      this.isSyncFail = true
    })
  }

  toogleDayTracking(dayIndex: number) {
    this.worker.trackingDays[dayIndex].tracked = !this.worker.trackingDays[dayIndex].tracked 
    this.workerRepository.toogleDayTracking(this.worker, dayIndex)
  }

  toogleAutoTracking() {
    this.autoTracking = !this.autoTracking
    this.worker.autoTracking = this.autoTracking
    this.workerRepository.toogleAutoTracking(this.worker)
  }

  sync() {
    this.workerRepository.sync(this.worker)
  }

}
