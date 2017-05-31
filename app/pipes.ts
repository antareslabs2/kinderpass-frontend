import {Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, start?: any, end?: any ):any{
    let limit = start ? start : 10;
    let trail = end ? end : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}