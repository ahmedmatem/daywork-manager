import { Injectable, Output } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NumberPickerService {

  @Output() onNumberPicked = new Subject<number>()
  @Output() onNumberChanged = new Subject<number>()
}
