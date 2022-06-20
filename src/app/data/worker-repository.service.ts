import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WorkerApiService } from '../data/remote-storage/worker-api.service'
import { DateRange } from '../models/DateRange'
import { Daywork } from '../models/Daywork'
import { Worker } from '../models/Worker'
import { IDictionary } from '../share/utils'
import { DayworkLocalstorageService } from './local-storage/daywork-local-storage.service'
import { WorkerLocalStorage } from './local-storage/worker-local-storage.service'
import { DayworkApiService } from './remote-storage/daywork-api.service'

@Injectable({
  providedIn: 'root'
})
export class WorkerRepositoryService {

  private workers: Worker[]
  private dayworks = {} as IDictionary<Daywork[]>

  onWorkersChanged = new Subject<Worker[]>()
  onErrorOcurred = new Subject<string>()
  onSyncFail = new Subject<void>()
  onDayworksChanged = new Subject<IDictionary<Daywork[]>>()

  constructor(
    private workerApiService: WorkerApiService,
    private workerLocalStorage: WorkerLocalStorage,
    private dayworkApiService: DayworkApiService,
    private dayworlLocalStoirage: DayworkLocalstorageService) {

    // Try loading workers from local storage
    this.workers = this.workerLocalStorage.getWorkers()
    if (this.workers.length === 0) {
      // In case of no workers saved in local storage request workers from remote storage
      this.workerApiService.fetchWorkers().subscribe(workers => {
          this.workers = workers
          this.onWorkersChanged.next(this.workers.slice())
        })
    }
  }

  getWorkers() {
    return this.workers.slice()
  }

  /**
   * This function retrieves all dayworks for all workers
   * in given dateRange from local storage
   * */

  workersDayworksFromLocalStorage(dateRange: DateRange)
    : { workerId: string, dayworks: Daywork[] }[] {
    const result: {workerId: string, dayworks: Daywork[]}[] = []
    this.workers?.forEach(worker => {
      result.push({
        workerId: worker.id,
        dayworks: this.dayworlLocalStoirage.getDayworks(worker.id, dateRange)
      })
    })
    return result
  }

  /**
   * This function retrieves dayworks in a given dateRange for
   * all workers from remote server.
   * @param dateRange
   */

  workersDayworksFromRemoteDb(dateRange: DateRange) {
    const result: { workerId: string, dayworks: Daywork[] }[] = []
    this.dayworkApiService.getDayworks(dateRange)
      .subscribe(dayworks => {
        this.dayworks = dayworks
        this.onDayworksChanged.next(this.dayworks)
      })
  }

  /**
   * Save workers dayworks in both local storage and remote database.
   * 
   * @param dateRange
   * @param workersDayworks
   */

  saveDayworks(
    dateRange: DateRange,
    ...workersDayworks: { workerId: string, dayworks: Daywork[] }[]) {
    this.dayworkApiService.save(dateRange, ...workersDayworks)
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
          this.workers.push(worker)
          // Send workers changed event to observers
          this.onWorkersChanged.next(this.workers.slice())
        },
        error => {
          this.onErrorOcurred.next(':( No internet connection. Check your connection and try again.')
        })
  }
  /**
   * This function fetch workers from Server,
   * store them into local storage and populate
   * workers emitting onWorkersChanged event.
   * */
  fetchWorkers() {
    this.workerApiService.fetchWorkers()
      .subscribe(
        workers => {
          this.workers = workers
          this.onWorkersChanged.next(this.workers)
          this.workerLocalStorage.save(...workers)
        },
        error => {
          switch (error.name) {
            case 'HttpErrorResponse':
              this.onErrorOcurred.next("No internet connection! :( Try again later.")
              break
            default:
              this.onErrorOcurred.next("Undefined error ocurred!")
          }
        })
  }

  toogleDayTracking(worker: Worker, dayIndex: number) {
    const workerInWorkers = this.workers.find((w) => w === worker)
    workerInWorkers!.trackingDays[dayIndex].tracked =
      !workerInWorkers?.trackingDays[dayIndex].tracked

    this.updateWorker(worker)
  }

  toogleAutoTracking(worker: Worker) {
    // find the worker whos daywork work status changed
    const workerInWorkers = this.workers.find((w) => w === worker)
    workerInWorkers!.autoTracking = !workerInWorkers?.autoTracking

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
      .subscribe(
        response => {
          this.workerLocalStorage.save(worker)
        },
        error => {
          // If update on remote maschine fail et syncronization property
          worker.isSyncRequired = true
          this.workerLocalStorage.save(worker)
        })
  }

}
