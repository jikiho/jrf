/**
 * Provides a request timeout.
 *
 * Using the "Keep-Alive" header to pass a request configuration.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive
 */
import {HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {ConfigService} from '../config.service';

export class TimeoutInterceptor implements HttpInterceptor {
    constructor(private config: ConfigService) {
    }

    /**
     * Prepares timeout settings and calls for a request.
     */
    intercept(original: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const keepAlive = original.headers.get('Keep-Alive') || '',
            values = keepAlive && keepAlive.match(/\btimeout=([0-9]+)\b/),
            timeout = values && parseInt(values[1]) || this.config.requestTimeout, //seconds
            request = original.clone({
                headers: original.headers.delete('Keep-Alive')
            });

        if (timeout) {
            return this.makeRequest(request, next, timeout);
        }

        return next.handle(request);
    }

    /**
     * Makes a request with timeout settings.
     */
    private makeRequest(request: HttpRequest<any>, next: HttpHandler,
            timeout: number): Observable<HttpEvent<any>> {
        const msec = timeout * 1000; //milliseconds

        return next.handle(request).timeout(msec)
            .catch((error: Error) => {
                if (error.name === 'TimeoutError') {
                    error = new HttpErrorResponse({
                        status: 524,
                        statusText: 'A timeout occurred',
                        url: request.urlWithParams
                    });
                }

                return Observable.throw(error);
            });
    }
}
