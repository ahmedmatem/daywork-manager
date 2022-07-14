import { Directive } from '@angular/core'
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms'
import { catchError, map, Observable, of, Subject } from 'rxjs'
import { WorkerApiService } from '../data/remote-storage/worker-api.service'

export interface FetchNamesService {
  isForbiddenName(name: string): Observable<boolean>
}

@Directive({
  selector: '[appForbiddenName]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ForbiddenNameDirective,
      multi: true
    }
  ]
})
export class ForbiddenNameDirective implements AsyncValidator {

  constructor(private workerApiService: WorkerApiService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.workerApiService.isForbiddenName(control.value)
      .pipe(
        map(isForbidden => (isForbidden ? { forbiddenName: true } : null)),
        catchError(() => of(null))
      )
  }
}
