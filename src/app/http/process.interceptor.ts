/**
 * Provides a request processing and cancelation.
 */
import {HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {AppService} from '../app.service';
import {ConfigService} from '../config.service';
import {ProcessService, ProcessModel} from '../process.service';

export class ProcessInterceptor implements HttpInterceptor {
    constructor(private app: AppService, private config: ConfigService,
            private process: ProcessService) {
    }

    /**
     * Prepares a request process and cancelation.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cancelable = /*request.headers.get('...') ||*/ this.config.requestCancelable,
            process = this.process.init({
                subject: request,
                cancelable
            });

        if (cancelable) {
            return next.handle(request)
                .takeUntil(process.cancels$.flatMap((event: Event) => this.canceled(request, event)))
                .finally(() => this.process.finish(process));
        }

        return next.handle(request)
            .finally(() => this.process.finish(process));
    }

    /**
     * Returns a request cancelation result.
     */
    private canceled(request: HttpRequest<any>, event: Event): Observable<any> {
        const error = new HttpErrorResponse({
            status: 499,
            statusText: 'Client closed request',
            url: request.url
        });

        /*
        if (this.config.debug) {
            console.debug(`CANCEL ${request.method || 'REQUEST'}`, request.url, request);
        }
        */

        return Observable.throw(error);
    }

    /**
     * Confirms a request cancelation.
     */
    private confirm(request: HttpRequest<any>) {
        const message = request.url;

        //this.app.confirm(message, () => ...);
    }
}
