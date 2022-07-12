import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { forkJoin, map, Observable } from "rxjs"
import { environment } from "../../../environments/environment.prod"
import { DB_URL, KEY_DAYWORKS } from "../../app.config"
import { AuthService } from "../../auth/auth.service"
import { DateRange } from "../../models/DateRange"
import { Daywork } from "../../models/Daywork"
import { IDictionary } from "../../share/utils"

const WORKERS_END_POINT = 'workers'
const DAYWORKS_END_POINT = 'dayworks'

@Injectable({ providedIn: 'root' })
export class DayworkApiService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  save(
    id: string,
    dateRange: DateRange,
    ...workersDayworks: { workerId: string, dayworks: Daywork[] }[]
  ) {
    const reqs: Observable<any>[] = []
    workersDayworks?.forEach(wd => {
      //const url = `${DB_URL}${KEY_DAYWORKS}/${dateRange.toString()}/${wd.workerId}.json`
      //console.log(`Save url: ${url}`)
      //const payload = {
      //  range: dateRange.toString(),
      //  uid: wd.workerId,
      //  dayworks: wd.dayworks
      //}
      //console.log('url: ' + url)
      //console.log('userId: ' + this.authService.user.value?.id)
      //console.log('token: ' + this.authService.user.value?.token)
      //console.log('range: ' + dateRange.toString())
      //console.log('uid: ' + wd.workerId)
      //console.log('dayworks: ' + (wd.dayworks as Daywork[]))

      const url = `${environment.apiBaseUrl}/${WORKERS_END_POINT}/${id}/${DAYWORKS_END_POINT}/${dateRange.toString()}`
      const req = this.http.patch(url, { dayworks: wd.dayworks })
      reqs.push(req)
    })

    if (reqs) {
      forkJoin(reqs)
        .subscribe(
          response => {
            console.log('Dayworks was successfully saved.')
          },
          error => {
            console.log('Some error occured!')
          }
        )
    }
  }

  getWorkerDayworks(
    id: string,
    dateRange: DateRange
  ): Observable<IDictionary<Daywork[]>> {
    const result: IDictionary<Daywork[]> = {} as IDictionary<Daywork[]>
    const url = `${environment.apiBaseUrl}/${WORKERS_END_POINT}/${id}/${DAYWORKS_END_POINT}/${dateRange.toString()}`
    return this.http.get<Daywork[]>(url)
      .pipe(
        map(dws => {
          result[id] = dws
          return result
        })
      )
  }

  getDayworks(dateRange: DateRange): Observable<IDictionary<Daywork[]>> {
    const result = {} as IDictionary<Daywork[]>
    const url = `${DB_URL}${KEY_DAYWORKS}/${dateRange.toString()}.json`
    return this.http.get<Daywork[][]>(url)
      .pipe(
        map(responseData => {
          const dayworks: Daywork[] = []
          for (const key in responseData) {
            result[key] = responseData[key]
          }
          return result
        }))
  }
}
