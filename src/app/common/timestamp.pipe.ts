/**
 * Converts a date value to the corresponding timestamp string.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

/**
 * Timestamp formats.
 */
const ALIASES = {
    // a long localized GMT format
    long: 'yyyy-MM-dd HH:mm:ss.SSS OOOO'
};

@Pipe({
    name: 'timestamp'
})
export class TimestampPipe extends DatePipe {
    transform(value: string, pattern: string = 'long', ...args): string {
        return super.transform(value, ALIASES[pattern] || pattern, ...args);
    }
}
