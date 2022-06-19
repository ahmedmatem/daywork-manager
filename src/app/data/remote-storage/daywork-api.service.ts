import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { DB_URL, KEY_DAYWORKS } from "../../app.config";
import { AuthService } from "../../auth/auth.service";
import { User } from "../../auth/user.model";
import { DateRange } from "../../models/DateRange";
import { Daywork } from "../../models/Daywork";
import { IDictionary } from "../../share/utils";

@Injectable({ providedIn: 'root' })
export class DayworkApiService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  save(dateRange: DateRange, ...workersDayworks: { workerId: string, dayworks: Daywork[] }[]) {
    workersDayworks?.forEach(wd => {
      this.http.put(this.setUrl(wd.workerId, dateRange), wd.dayworks)
        .subscribe(response => {
          //console.log(response)
        })
    })
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

  private setUrl(workerId: string, dateRange: DateRange): string {
    /**
     *      base_api_url/dw/{   dateRange    }/{     workerId     }.json
     * url: base_api_url/dw/2022-6-6-2022-6-19/-N3kYDkUV-EVEH6Rrsxg.json
     * */
    return `${DB_URL}${KEY_DAYWORKS}/${dateRange.toString()}/${workerId}.json`
  }
}
