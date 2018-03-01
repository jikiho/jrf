/**
 * Main application module.
 */
import {NgModule} from '@angular/core';
import {BrowserModule as NgBrowserModule} from '@angular/platform-browser';
import {FormsModule as NgFormsModule} from '@angular/forms';

import {AboutComponent} from './about.component';
import {AppComponent} from './app.component';
import {AppMenuComponent} from './app-menu.component';
import {AppRoutingModule} from './app-routing.module';
import {AppService} from './app.service';
import {CommonModule} from './common/common.module';
import {ConfigService} from './config.service';
import {HistoryModule} from './history.module';
import {HomeComponent} from './home.component';
import {HttpModule} from './http/http.module';
import {PravnickaOsobaModule} from './pravnicka-osoba/pravnicka-osoba.module';
import {ProcessService} from './process.service';
import {WindowModule} from './window.module';

@NgModule({
    declarations: [
        AboutComponent,
        AppComponent,
        AppMenuComponent,
        HomeComponent
    ],
    imports: [
        CommonModule,
        HistoryModule,
        HttpModule,
        NgBrowserModule,
        NgFormsModule,
        WindowModule,
        // feature modules with routing
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
