import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(
    value: Timestamp | Date | null,
    format: string = 'MM/dd/yyyy'
  ): string {
    if (!value) return '';

    let date: Date;

    // If the value is a Firestore Timestamp, convert it to a JavaScript Date
    if (value instanceof Timestamp) {
      date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
    } else if (value instanceof Date) {
      date = value; // If it's already a Date object, use it directly
    } else {
      return ''; // In case of an unsupported type
    }

    // Use Angular's DatePipe to format the Date object
    return this.datePipe.transform(date, format) || '';
  }
}
