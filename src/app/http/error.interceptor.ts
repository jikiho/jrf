/**
 * Provides a standard error handling.
 */
import {HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {ConfigService} from '../config.service';

export class ErrorInterceptor implements HttpInterceptor {
    constructor(private config: ConfigService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .catch((error: Error) => {
                const empty = true;

                if (error instanceof HttpErrorResponse) {
                    if (this.config.debug) {
                        console.debug('FAILED', error.status, error.url, error);
                    }
                }
                else {
                    if (this.config.debug) {
                        console.debug('FAILED', error);
                    }
                }

                if (empty) {
                    return Observable.empty();
                }

                return Observable.throw(error);
            });
    }
}
