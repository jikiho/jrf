/**
 * Main application module.
 */
import {NgModule} from '@angular/core';
import {BrowserModule as NgBrowserModule} from '@angular/platform-browser';
import {FormsModule as NgFormsModule} from '@angular/forms';

import {AboutComponent} from './about.component';
import {AddressComponent} from './address.component';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppService} from './app.service';
import {CommonModule} from './common/common.module';
import {ConfigService} from './config.service';
import {FilesComponent} from './files.component';
import {HistoryModule} from './history.module';
import {HomeComponent} from './home.component';
import {HttpModule} from './http/http.module';
import {ProcessService} from './process.service';
import {WindowModule} from './window.module';

@NgModule({
    declarations: [
        AboutComponent,
        AddressComponent,
        AppComponent,
        FilesComponent,
        HomeComponent
    ],
    imports: [
        WindowModule,
        AppRoutingModule,
        NgBrowserModule,
        NgFormsModule,
        CommonModule,
        HistoryModule,
        HttpModule
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
