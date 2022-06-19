import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { DB_URL, KEY_DAYWORKS } from "../../app.config";
import { AuthService } from "../../auth/auth.service";
import { DateRange } from "../../models/DateRange";
import { Daywork } from "../../models/Daywork";
import { IDictionary } from "../../share/utils";

@Injectable({ providedIn: 'root' })
export class DayworkApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  save(dateRange: DateRange, ...workersDayworks: { workerId: string, dayworks: Daywork[] }[]) {
    const reqs: Observable<any>[] = []
    workersDayworks?.forEach(wd => {
      const url = `${DB_URL}${KEY_DAYWORKS}/${dateRange.toString()}/${wd.workerId}.json`
      const req = this.http.put(url, wd.dayworks)
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
