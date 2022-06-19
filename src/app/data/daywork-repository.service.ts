//import { Injectable } from "@angular/core";
//import { Daywork } from '../models/Daywork'
//import { Worker } from "../models/Worker";
//import { DayworkLocalstorageService } from "./local-storage/daywork-local-storage.service";
//import { DayworkApiService } from "./remote-storage/daywork-api.service";

//@Injectable({providedIn: 'root'})
//export class DayworkRepositoryService {
//  private workersDayworks: { workerId: string, dayworks: Daywork[] }[] = []

//  constructor(
//    private workers: Worker[],
//    private dayworkApiService: DayworkApiService,
//    private dayworkLocalStorage: DayworkLocalstorageService) {
//    workers?.forEach(worker => {
//      this.workersDayworks.push({
//        workerId: worker.id,
//        dayworks: dayworkLocalStorage.getWorkerDayworks(worker.id)
//      })
//    })
//  }

//  getWorkersDayworks() {
//    return this.workersDayworks.slice()
//  }


//}
