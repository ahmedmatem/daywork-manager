import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Worker } from "../../models/Worker"
import { map, Observable, Subject } from "rxjs"
import { DB_URL, WORKERS_END_POINT } from "../../app.config"
import { environment } from "../../../environments/environment.prod"

//const WORKERS_JSON = 'workers.json'

@Injectable({ providedIn: 'root' })
export class WorkerApiService {
  //onFetchWorkers = new Subject <Worker[]>()

  constructor(private http: HttpClient) {
    
  }

  //storeWorker(worker: Worker) {
  //  this.http.post<Worker>(DB_URL + WORKERS_JSON, worker)
  //    .subscribe(response => {
  //      worker.id = response.name
  //      this.onSave.next(worker)
  //    })
  //}

  storeWorker(worker: Worker): Observable<{ id: string }> {
    return this.http.post<Worker>(DB_URL + WORKERS_END_POINT + '.json', worker)
      .pipe(map(response => {
        return { id: response.name }
      }))
  }

  updateWorker(worker: Worker): Observable<any> {
    return this.http.patch(
      `${environment.apiBaseUrl}/${WORKERS_END_POINT}/${worker.id}`,
      { worker: worker }
    )
    //return this.http.put<Worker>(DB_URL + WORKERS_END_POINT + '/' + worker.id + '.json', worker)
  }

  fetchWorker(id: string): Observable<Worker> {
    return this.http.get<Worker>(
      `${environment.apiBaseUrl}/${WORKERS_END_POINT}/${id}`
    )
  }

  fetchWorkers(): Observable<Worker[]> {
    //return this.http.get<Worker[]>(DB_URL + WORKERS_END_POINT + '.json')
    //  .pipe(map(responseData => {
    //    const workers: Worker[] = []
    //    for (const key in responseData) {
    //      if (responseData.hasOwnProperty(key)) {
    //        workers.push({ ...responseData[key], id: key })
    //      }
    //    }
    //    for (let i = 0; i < workers?.length; i++) {
    //      workers[i].registeredOn = new Date(workers[i].registeredOnInMillis)
    //    }
    //    return workers
    //  }))
    return this.http.get<Worker[]>(
      `${environment.apiBaseUrl}/${WORKERS_END_POINT}`
    ).pipe(
      map(resData => {
        const workers: Worker[] = []
        for (let key in resData) {
          // set registeredOn from millis
          resData[key].registeredOn = new Date(resData[key].registeredOnInMillis)
          if (resData.hasOwnProperty(key)) {
            workers.push({ ...resData[key], id: key })
          }
        }
        return workers
      })
    )
  }
}
