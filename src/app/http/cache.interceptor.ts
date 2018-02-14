/**
 * Provides a request/response cache.
 *
 * Using the "Cache-Control" header to pass a request configuration.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 *
 * Request configuration directives:
 * if-no-match[=<etag>] (uses cached response etag by default)
 * max-age=<seconds>
 * min-fresh=<seconds>
 * must-revalidate (same as max-age=0)
 * no-cache
 * no-store
 * only-if-cached
 * private
 * public
 */
import {HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';

import {ConfigService} from '../config.service';
import {UtilsModule as utils} from '../utils.module';

export class CacheInterceptor implements HttpInterceptor {
    /**
     * Request/response cache storage.
     */
    private storage = new Map<string, HttpResponse<any>>();

    constructor(private config: ConfigService) {
    }

    /**
     * Prepares cache settings and calls for a request.
     */
    intercept(original: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cacheControl = original.headers.get('Cache-Control'),
            cachable = !/\bno-cache\b/.test(cacheControl),
            storable = !/\bno-store\b/.test(cacheControl),
            request = original.clone({
                headers: original.headers.delete('Cache-Control')
            });

        if (this.config.requestCache && (cachable || storable)) {
            return this.makeRequest(request, next, cachable, storable);
        }

        return next.handle(request);
    }

    /**
     * Makes a request to get, store or reuse a response.
     */
    private makeRequest(request: HttpRequest<any>, next: HttpHandler,
            cachable: boolean, storable: boolean): Observable<HttpEvent<any>> {
        const key = this.getKey(request);

        if (key && cachable) {
            const response = this.storage.get(key);

            if (response) {
                if (this.config.debug) {
                    console.debug(`CACHED ${request.method || 'REQUEST'}`, response.url, request);
                }

                return Observable.of(response.clone());
            }
        }

        if (key && storable) {
            return next.handle(request)
                .do(response => {
                    if (response instanceof HttpResponse) {
                        this.storage.set(key, response);
                    }
                });
        }

        return next.handle(request);
    }

    /**
     * Gets a unique cache storage key.
     */
    private getKey(request: HttpRequest<any>): string | null {
        //return JSON.stringify(utils.sortByKeys({...request}));
        return JSON.stringify(request);
    }
}
