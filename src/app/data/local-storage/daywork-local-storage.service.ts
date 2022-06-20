import { Injectable } from "@angular/core";
import { KEY_DAYWORKS } from "../../app.config";
import { DateRange } from "../../models/DateRange";
import { Daywork } from "../../models/Daywork";

@Injectable({ providedIn: 'root' })
export class DayworkLocalstorageService {

  constructor() { }

  save(dateRange: DateRange, ...workersDayworks: { workerId: string, dayworks: Daywork[] }[]) {
    workersDayworks?.forEach((wd) => {
      localStorage.setItem(this.itemKey(wd.workerId, dateRange), JSON.stringify(wd.dayworks))
    })
  }

  getDayworks(workerId: string, dateRange: DateRange): Daywork[] {
    return JSON.parse(localStorage.getItem(this.itemKey(workerId, dateRange)) || '[]')
  }

  private itemKey(workerId: string, dateRange: DateRange): string {
    /**
     *      dw/{   dateRange    }/{     workerId     }
     * key: dw/2022-6-6-2022-6-19/-N3kYDkUV-EVEH6Rrsxg
     * */
    return `${KEY_DAYWORKS}/${dateRange.toString()}/${workerId}`
  }
}
