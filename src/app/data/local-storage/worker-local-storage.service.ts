import { Injectable } from "@angular/core";
import { KEY_WORKERS_IDS } from "../../app.config";
import { Worker } from "../../models/Worker";

@Injectable({providedIn: "root"})
export class WorkerLocalStorage {

  constructor() { }

  save(...workers: Worker[]) {
    workers?.forEach(worker => {
      this.saveWorkerId(worker.id)
      localStorage.setItem(worker.id, JSON.stringify(worker))
    })
  }

  getWorkers(): Worker[] {
    const workers: Worker[] = []
    const idsArr = this.getWorkersIds()
    idsArr?.forEach(id => {
      const worker = localStorage.getItem(id)
      if (worker) {
        const workerObj: Worker = JSON.parse(worker)
        workerObj.registeredOn = new Date(workerObj.registeredOnInMillis)
        workers.push(workerObj)
      }
    })
    return workers
  }

  private saveWorkerId(workerId: string) {
    const ids = localStorage.getItem(KEY_WORKERS_IDS)
    let idsArr = ids ? ids.split(',') : []
    if (!idsArr.includes(workerId)) {
      idsArr.push(workerId)
      localStorage.setItem(KEY_WORKERS_IDS, idsArr.toString())
    }
  }

  private getWorkersIds(): string[] {
    const ids = localStorage.getItem(KEY_WORKERS_IDS)
    const idsArr = ids ? ids.split(',') : []
    return idsArr
  }
}
