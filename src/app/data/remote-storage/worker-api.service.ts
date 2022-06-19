import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Worker } from "../../models/Worker"
import { map, Observable, Subject } from "rxjs"
import { DB_URL } from "../../app.config"

const WORKERS_JSON = 'workers.json'
const WORKERS = 'workers'

@Injectable({ providedIn: 'root' })
export class WorkerApiService {
  onFetchWorkers = new Subject <Worker[]>()

  constructor(private http: HttpClient) {
    
  }

  //storeWorker(worker: Worker) {
  //  this.http.post<Worker>(DB_URL + WORKERS_JSON, worker)
  //    .subscribe(response => {
  //      worker.id = response.name
  //      this.onSave.next(worker)
  //    })
  //}

  storeWorker(worker: Worker): Observable<{id: string}> {
    return this.http.post<Worker>(DB_URL + WORKERS_JSON, worker)
      .pipe(map(response => {
        return { id: response.name }
      }))
  }

  updateWorker(worker: Worker): Observable<any> {
    return this.http.put<Worker>(DB_URL + WORKERS + '/' + worker.id + '.json', worker)
  }

  fetchWorkers(): Observable<Worker[]> {
    return this.http.get<Worker[]>(DB_URL + WORKERS_JSON)
      .pipe(map(responseData => {
        const workers: Worker[] = []
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            workers.push({ ...responseData[key], id: key })
          }
        }
        for (let i = 0; i < workers?.length; i++) {
          workers[i].registeredOn = new Date(workers[i].registeredOnInMillis)
        }
        return workers
      }))
  }
}
