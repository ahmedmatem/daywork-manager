import { Pipe, PipeTransform } from "@angular/core";

export interface IDictionary<T> {
  [index: string]: T
}

