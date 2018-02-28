/**
 * Common module with enhancements.
 */
import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {RouterModule as NgRouterModule} from "@angular/router";

import {BoolericPipe} from './booleric.pipe';
import {BytesPipe} from './bytes.pipe';
import {DatericPipe} from './dateric.pipe';
import {DialogDirective} from './dialog.directive';
import {EnabledDirective} from './enabled.directive';
import {FormResetDirective, ButtonClearDirective} from './form-reset.directive';
import {FormValidateDirective} from './form-validate.directive';
import {InputFileDirective} from './input-file.directive';
import {NumericPipe} from './numeric.pipe';
import {OutputForDirective} from './output-for.directive';
import {ProvideControlDirective} from './provide-control.directive';
import {SafeUrlPipe} from './safe-url.pipe';
import {StringifyPipe} from './stringify.pipe';
import {TimestampPipe} from './timestamp.pipe';
import {UnavailablePipe} from './unavailable.pipe';

@NgModule({
    imports: [
        NgCommonModule,
        NgRouterModule
    ],
    declarations: [
        BoolericPipe,
        ButtonClearDirective,
        BytesPipe,
        DatericPipe,
        DialogDirective,
        EnabledDirective,
        FormResetDirective,
        FormValidateDirective,
        InputFileDirective,
        NumericPipe,
        OutputForDirective,
        ProvideControlDirective,
        SafeUrlPipe,
        StringifyPipe,
        TimestampPipe,
        UnavailablePipe
    ],
    exports: [
        BoolericPipe,
        ButtonClearDirective,
        BytesPipe,
        DatericPipe,
        DialogDirective,
        EnabledDirective,
        FormResetDirective,
        FormValidateDirective,
        InputFileDirective,
        NgCommonModule,
        NgRouterModule,
        NumericPipe,
        OutputForDirective,
        ProvideControlDirective,
        SafeUrlPipe,
        StringifyPipe,
        TimestampPipe,
        UnavailablePipe
    ]
})
export class CommonModule {
}
