import { Component, HostBinding, OnInit } from '@angular/core'
import { Worker } from '../models/Worker'
import { WorkerApiService } from '../data/remote-storage/worker-api.service'
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap'
import { WorkerRepositoryService } from '../data/worker-repository.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css'],
  providers: [NgbAccordionConfig]
})
export class WorkersComponent implements OnInit {
  errorMessage?: string
  workers: Worker[] = []
  workerName = ''
  onWorkerExistsErr = new Subject<string>()

  loading = false

  constructor(
    private workerApiService: WorkerApiService,
    ngbAccordionConfig: NgbAccordionConfig,
    private workerRepository: WorkerRepositoryService) {
    
    //ngbAccordionConfig.closeOthers = true
    ngbAccordionConfig.type = 'success'
  }

  ngOnInit(): void {
    this.workers = this.workerRepository.getWorkers()

    // If no worker exists try to fetch them from remote server
    if (this.workers.length === 0) {
      this.loading = true // start spinner
      // Get workers from server and store them into local storage.
      // That will trigger onWorkersChanged event.
      this.workerRepository.fetchWorkers()
    }

    // Subscribe onErrorOcurred event
    this.workerRepository.onErrorOcurred.subscribe(errMessage => {
      this.loading = false
      this.errorMessage = errMessage
    })

    // Subscribe onWorkersChanged event
    this.workerRepository.onWorkersChanged
      .subscribe((workers: Worker[]) => {
        this.loading = false // stop spinner
        this.workers = workers
      })

    this.onWorkerExistsErr
      .subscribe(errMsg => { this.errorMessage = errMsg })
  }

  addWorker() {
    const newWorker = new Worker(this.workerName)

    if (this.workerExists()) {
      this.onWorkerExistsErr.next('Worker ' + this.workerName + ' already exists!')
    } else {

      // reset form fields
      this.errorMessage = undefined
      this.workerName = ''

      this.workerRepository.storeWorker(newWorker)
    }
  }

  onStoreWorkers() {
    //this.remoteStorageService.storeWorker()
  }

  onFetchWorkers() {
    this.workerApiService.fetchWorkers()
  }

  private workerExists(): boolean {
    return this.workers.some(w => w.name === this.workerName )
  }
}
