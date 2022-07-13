import { Injectable } from '@angular/core'
import { Subject, Subscription } from 'rxjs'
import { WorkerApiService } from '../data/remote-storage/worker-api.service'
import { DateRange } from '../models/DateRange'
import { Daywork } from '../models/Daywork'
import { Role } from '../models/Role'
import { Worker } from '../models/Worker'
import { IDictionary } from '../share/utils'
import { DayworkLocalstorageService } from './local-storage/daywork-local-storage.service'
import { WorkerLocalStorage } from './local-storage/worker-local-storage.service'
import { DayworkApiService } from './remote-storage/daywork-api.service'

@Injectable({
  providedIn: 'root'
})
export class WorkerRepositoryService {

  onError = new Subject<string>()
  onSyncFail = new Subject<void>()
  onFetchWorkers = new Subject<Worker[]>()
  onDayworksChanged = new Subject<IDictionary<Daywork[]>>()

  private _workers: Worker[] = []
  //private dayworks = {} as IDictionary<Daywork[]>

  private workersSub = new Subscription()

  constructor(
    private workerApiService: WorkerApiService,
    private workerLocalStorage: WorkerLocalStorage,
    private dayworkApiService: DayworkApiService,
    private dayworlLocalStoirage: DayworkLocalstorageService) {

    // Try loading workers from local storage
    //this._workers = this.workerLocalStorage.getWorkers()
    //if (this._workers.length === 0) {
    //  // In case of no workers saved in local storage request workers from remote storage
    //  this.workerApiService.fetchWorkers().subscribe(workers => {
    //      this._workers = workers
    //      this.onWorkersChanged.next(this._workers.slice())
    //    })
    //}

    //this.workerApiService.fetchWorkers().subscribe(
    //    workers => {
    //      this._workers = workers
    //    })
    //this.fetchWorkers()
  }

  get workers() {
    return this._workers.slice()
  }

  /**
   * This function retrieves all dayworks for all workers
   * in given dateRange from local storage
   * */

  //workersDayworksFromLocalStorage(dateRange: DateRange)
  //  : { workerId: string, dayworks: Daywork[] }[] {
  //  const result: {workerId: string, dayworks: Daywork[]}[] = []
  //  this._workers?.forEach(worker => {
  //    result.push({
  //      workerId: worker.id,
  //      dayworks: this.dayworlLocalStoirage.getDayworks(worker.id, dateRange)
  //    })
  //  })
  //  return result
  //}

  /**
   * This function retrieves dayworks in a given dateRange for
   * all workers from remote server.
   * @param dateRange
   */

  //workersDayworksFromRemoteDb(dateRange: DateRange) {
  //  //const result: { workerId: string, dayworks: Daywork[] }[] = []
  //  this.dayworkApiService.getDayworks(dateRange)
  //    .subscribe(dayworks => {
  //      //this.dayworks = dayworks
  //      this.onDayworksChanged.next(dayworks)
  //    })
  //}

  //getAllDayworks(dateRange: DateRange) {
  //  this.dayworkApiService.getAllDayworks(dateRange)
  //    .subscribe(dayworks => {
  //      console.log('Dayworks FROM repository')
  //      console.log(JSON.stringify(dayworks))
  //      this.onDayworksChanged.next(dayworks)
  //    })
  //}

  getDayworks(dateRange: DateRange, workerId?: string) {
    this.dayworkApiService.getDayworks(dateRange, workerId)
      .subscribe(
        dws => {
          this.onDayworksChanged.next(dws)
        }
      )
  }

  /**
   * Save workers dayworks in both local storage and remote database.
   * 
   * @param dateRange
   * @param workersDayworks
   */

  saveDayworks(
    id: string,
    dateRange: DateRange,
    ...workersDayworks: { workerId: string, dayworks: Daywork[] }[]
  ) {
    this.dayworkApiService.save(id, dateRange, ...workersDayworks)
    this.dayworlLocalStoirage.save(dateRange, ...workersDayworks)
  }

  /**
   * Save worker in both local storage and remote database.
   * 
   * @param worker
   */

  saveWorker(worker: Worker) {
    // Store worker in remote storage
    this.workerApiService.storeWorker(worker)
      .subscribe(
        data => {
          // Store worker in local storage
          worker.id = data.id
          this.workerLocalStorage.save(worker)

          // Add worker in local workers array
          this._workers.push(worker)
          // Send workers changed event to observers
          this.onFetchWorkers.next(this._workers.slice())
        },
        error => {
          this.onError.next(':( No internet connection. Check your connection and try again.')
        })
  }
  /**
   * This function fetch workers from Server,
   * store them into local storage and populate
   * workers emitting onWorkersChanged event.
   * */
  fetchWorkers() {
    this._workers = [] // set empty workers list
    this.workerApiService.fetchWorkers()
      .subscribe({
        next: (workers) => {
          this._workers = workers
          this.onFetchWorkers.next(this.workers)
          this.workerLocalStorage.save(...workers)
        },
        error: error => {
          switch (error.name) {
            case 'HttpErrorResponse':
              this.onError.next("No internet connection! :( Try again later.")
              break
            default:
              this.onError.next("Undefined error ocurred!")
          }
        }
      })
  }

  fetchWorker(id: string) {
    this._workers = [] // set empty workers list
    this.workerApiService.fetchWorker(id)
      .subscribe(
        worker => {
          this._workers.push(worker)
          this.onFetchWorkers.next(this.workers)
        }
      )
  }

  toogleDayTracking(worker: Worker, dayIndex: number) {
    this.updateWorker(worker)
  }

  toogleAutoTracking(worker: Worker) {
    this.updateWorker(worker)
  }

  /**
   * This function uploads changes have made locally into remote database
   * */
  sync(worker: Worker) {
    worker.isSyncRequired = false
    this.workerApiService.updateWorker(worker)
      .subscribe(
        response => {
          // do nothing
        },
        error => {
          // If update on remote maschine fail set syncronization property
          worker.isSyncRequired = true
          this.onSyncFail.next()
        })
  }

  private updateWorker(worker: Worker) {
    worker.isSyncRequired = false
    this.workerApiService.updateWorker(worker)
      .subscribe({
        next: response => {
          this.workerLocalStorage.save(worker)
        },
        error: error => {
          // If update on remote maschine fail set syncronization property
          worker.isSyncRequired = true
          this.workerLocalStorage.save(worker)
        }
      })
  }

}
