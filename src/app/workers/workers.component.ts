import { Component, OnDestroy, OnInit } from '@angular/core'
import { Worker } from '../models/Worker'
import { WorkerApiService } from '../data/remote-storage/worker-api.service'
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap'
import { WorkerRepositoryService } from '../data/worker-repository.service'
import { Subject, Subscription } from 'rxjs'

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css'],
  providers: [NgbAccordionConfig]
})
export class WorkersComponent implements OnInit, OnDestroy {
  errorMessage?: string
  workers: Worker[] = []
  workerName = ''
  //onWorkerExistsErr = new Subject<string>()

  loading = false

  private onFetchWorkersSub = new Subscription

  constructor(
    private workerApiService: WorkerApiService,
    ngbAccordionConfig: NgbAccordionConfig,
    private workerRepository: WorkerRepositoryService) {    
    //ngbAccordionConfig.closeOthers = true
    ngbAccordionConfig.type = 'light'
  }

  ngOnInit(): void {
    //this.workers = this.workerRepository.workers

    // If no worker exists try to fetch them from remote server
    //if (this.workers.length === 0) {
    //  this.loading = true // start spinner
    //  // Get workers from server and store them into local storage.
    //  // That will trigger onWorkersChanged event.
    //  /*this.workerRepository.fetchWorkers()*/
    //}
    this.loading = true // start spinner
    this.workerRepository.fetchWorkers()

    // Subscribe onErrorOcurred event
    //this.workerRepository.onErrorOcurred.subscribe(errMessage => {
    //  this.loading = false
    //  this.errorMessage = errMessage
    //})

    // Subscribe onWorkersChanged event
    this.onFetchWorkersSub =
      this.workerRepository.onFetchWorkers.subscribe(
        (workers: Worker[]) => {
          this.loading = false // stop spinner
          this.workers = workers
        })

    //this.onWorkerExistsErr
    //  .subscribe(errMsg => { this.errorMessage = errMsg })
  }

  ngOnDestroy(): void {
    this.onFetchWorkersSub.unsubscribe()
  }

  //addWorker() {
  //  const newWorker = new Worker(this.workerName)

  //  if (this.workerExists()) {
  //    this.onWorkerExistsErr.next('Worker ' + this.workerName + ' already exists!')
  //  } else {

  //    // reset form fields
  //    this.errorMessage = undefined
  //    this.workerName = ''

  //    this.workerRepository.saveWorker(newWorker)
  //  }
  //}

  //onStoreWorkers() {
  //  //this.remoteStorageService.storeWorker()
  //}

  //onFetchWorkers() {
  //  this.workerApiService.fetchWorkers()
  //}

  //private workerExists(): boolean {
  //  return this.workers.some(w => w.name === this.workerName )
  //}
}
