/**
 * Keeps a value as a safe URL content.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Pipe({
    name: 'safeurl'
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }

    transform(value: any): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(value);
    }
}
