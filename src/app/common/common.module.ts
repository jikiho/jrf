/**
 * Common module with enhancements.
 */
import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {RouterModule as NgRouterModule} from "@angular/router";
import {FormsModule as NgFormsModule} from '@angular/forms';

import {BoolericPipe} from './booleric.pipe';
import {BytesPipe} from './bytes.pipe';
import {DatericPipe} from './dateric.pipe';
import {DialogDirective} from './dialog.directive';
//import {EnabledDirective} from './enabled.directive';
import {FilterPipe} from './filter.pipe';
import {FormResetDirective, ButtonClearDirective} from './form-reset.directive';
import {FormValidateDirective} from './form-validate.directive';
import {HiddenDirective} from './hidden.directive';
import {InputFileDirective} from './input-file.directive';
import {JoinPipe} from './join.pipe';
import {NumericPipe} from './numeric.pipe';
import {OutputForDirective} from './output-for.directive';
import {PluckPipe} from './pluck.pipe';
import {ProvideControlDirective} from './provide-control.directive';
import {RouterLinkActiveDirective} from './router-link-active.directive';
import {SafeUrlPipe} from './safe-url.pipe';
import {StringifyPipe} from './stringify.pipe';
import {TimestampPipe} from './timestamp.pipe';
import {UnavailablePipe} from './unavailable.pipe';

@NgModule({
    imports: [
        NgCommonModule,
        NgFormsModule,
        NgRouterModule
    ],
    declarations: [
        BoolericPipe,
        ButtonClearDirective,
        BytesPipe,
        DatericPipe,
        DialogDirective,
        //EnabledDirective,
        FilterPipe,
        FormResetDirective,
        FormValidateDirective,
        HiddenDirective,
        InputFileDirective,
        JoinPipe,
        PluckPipe,
        RouterLinkActiveDirective,
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
        //EnabledDirective,
        FilterPipe,
        FormResetDirective,
        FormValidateDirective,
        HiddenDirective,
        InputFileDirective,
        JoinPipe,
        RouterLinkActiveDirective,
        NgCommonModule,
        NgFormsModule,
        NgRouterModule,
        NumericPipe,
        OutputForDirective,
        PluckPipe,
        ProvideControlDirective,
        SafeUrlPipe,
        StringifyPipe,
        TimestampPipe,
        UnavailablePipe
    ]
})
export class CommonModule {
}
