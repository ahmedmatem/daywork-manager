import { Component, Input, OnInit } from '@angular/core';
import { NumberPickerService } from './number-picker.service';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.css']
})
export class NumberPickerComponent implements OnInit {
  @Input() defaultValue: number = 0
  @Input() step: number = 1
  @Input() minValue: number = -8
  @Input() maxValue: number = 8
  @Input() pickerTextPattern: string = ''
  @Input() pickable: boolean = true

  /**
   * If pickerTextPattern contains [number] in itself
   * it will be replaced by property _value and assigned
   * to property pickerText which will be displayed.
   */
  pickerText = ''
  isMinValue: boolean = false
  isMaxValue: boolean = false

  private _value!: number

  constructor(private numberPickerService: NumberPickerService) { }

  ngOnInit(): void {
    this._value = this.defaultValue
    this.updatePickerText()
  }

  onNumberPicked() {
    this.numberPickerService.onNumberPicked.next(this._value)
  }

  onMinusClick() {
    if (this.isMaxValue) {
      this.isMaxValue = !this.isMaxValue
    }
    this._value -= this.step
    if (this._value <= this.minValue) {
      this.isMinValue = true
    }
    this.updatePickerText()
  }

  onPlusClick() {
    if (this.isMinValue) {
      this.isMinValue = !this.isMinValue
    }
    this._value += this.step
    if (this._value >= this.maxValue) {
      this.isMaxValue = true
    }
    this.updatePickerText()
  }

  get value() {
    return this._value
  }

  private updatePickerText() {
    this.pickerText = this.pickerTextPattern.replace('[number]', '' + this._value)
  }
}
