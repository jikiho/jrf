/**
 * Main application module.
 */
import {NgModule} from '@angular/core';
import {BrowserModule as NgBrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppService} from './app.service';
import {CommonModule} from './common/common.module';
import {ConfigService} from './config.service';
import {HistoryModule} from './history.module';
import {HttpModule} from './http/http.module';
import {PravnickaOsobaModule} from './pravnicka-osoba/pravnicka-osoba.module';
import {ProcessService} from './process.service';
import {UtilsModule} from './utils.module';
import {UvodniStrankaModule} from './uvodni-stranka/uvodni-stranka.module';
import {WindowModule} from './window.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CommonModule,
        HistoryModule,
        HttpModule,
        NgBrowserModule,
        UtilsModule,
        WindowModule,
        // feature modules with routing
        UvodniStrankaModule,
        PravnickaOsobaModule,
        // main application routing module
        AppRoutingModule
    ],
    providers: [
        AppService,
        ConfigService,
        ProcessService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
