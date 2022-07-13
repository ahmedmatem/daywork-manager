import { Component, OnDestroy, OnInit } from '@angular/core'
import { Worker } from '../models/Worker'
import { WorkerApiService } from '../data/remote-storage/worker-api.service'
import { ModalDismissReasons, NgbAccordionConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { WorkerRepositoryService } from '../data/worker-repository.service'
import { Subject, Subscription } from 'rxjs'
import { AuthService } from '../auth/auth.service'

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
  role: string
  //onWorkerExistsErr = new Subject<string>()

  modalCloseResult = ''

  isLoading = false

  private onFetchWorkersSub = new Subscription

  constructor(
    private authService: AuthService,
    private workerApiService: WorkerApiService,
    ngbAccordionConfig: NgbAccordionConfig,
    private modalService: NgbModal,
    private workerRepository: WorkerRepositoryService) {    
    //ngbAccordionConfig.closeOthers = true
    ngbAccordionConfig.type = 'light'

    this.role = authService.user.value?.role!
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
    this.isLoading = true // start spinner
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
          this.isLoading = false // stop spinner
          this.workers = workers
        })

    //this.onWorkerExistsErr
    //  .subscribe(errMsg => { this.errorMessage = errMsg })
  }

  openModal(content: any) {
    this.modalService.open(content, { centered: true, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.modalCloseResult = `Closed with: ${result}`
    }, (reason) => {
      this.modalCloseResult = `Dismissed ${this.getDismissReason(reason)}`
    })
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC'
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop'
    } else {
      return `with: ${reason}`
    }
  }
}
