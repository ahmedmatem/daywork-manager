import { Component, Input, OnInit } from '@angular/core';
import { NumberPickerService } from './number-picker.service';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.css']
})
export class NumberPickerComponent implements OnInit {
  @Input() defaultValue: string = ''
  @Input() step: string = '1'
  @Input() minValue: string = '-8'
  @Input() maxValue: string = '8'

  isMinValue: boolean = false
  isMaxValue: boolean = false

  private _value!: number

  constructor(private numberPickerService: NumberPickerService) { }

  ngOnInit(): void {
    this._value = +this.defaultValue
  }

  onNumberPicked() {
    this.numberPickerService.onNumberPicked.next(this._value)
  }

  onMinusClick() {
    if (this.isMaxValue) {
      this.isMaxValue = !this.isMaxValue
    }
    this._value -= +this.step
    if (this._value === +this.minValue) {
      this.isMinValue = true
    }
  }

  onPlusClick() {
    if (this.isMinValue) {
      this.isMinValue = !this.isMinValue
    }
    this._value += +this.step
    if (this._value === +this.maxValue) {
      this.isMaxValue = true
    }
  }

  get value() {
    return this._value
  }
}
