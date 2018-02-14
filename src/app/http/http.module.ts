/**
 * HTTP client enhancement.
 */
import {NgModule} from '@angular/core';
import {HttpClientModule as NgHttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import {AppService} from '../app.service';
import {CacheInterceptor} from './cache.interceptor';
import {ConfigService} from '../config.service';
import {ErrorInterceptor} from './error.interceptor';
import {HttpService} from './http.service';
import {LanguageInterceptor} from './language.interceptor';
import {ProcessInterceptor} from './process.interceptor';
import {ProcessService} from '../process.service';
import {RequestInterceptor} from './request.interceptor';
import {ResponseInterceptor} from './response.interceptor';
import {TimeoutInterceptor} from './timeout.interceptor';

@NgModule({
    imports: [
        NgHttpClientModule
    ],
    providers: [
        HttpService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true,
            deps: [AppService, ConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true,
            deps: [ConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LanguageInterceptor,
            multi: true,
            deps: [AppService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CacheInterceptor,
            multi: true,
            deps: [ConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true,
            deps: [AppService, ConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TimeoutInterceptor,
            multi: true,
            deps: [ConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ProcessInterceptor,
            multi: true,
            deps: [AppService, ConfigService, ProcessService]
        }
    ]
})

export class HttpModule {
}
