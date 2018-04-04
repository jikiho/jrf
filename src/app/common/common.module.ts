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
import {FileComponent} from './file.component';
import {FileIconPipe} from './file-icon.pipe';
import {FilterPipe} from './filter.pipe';
import {FormControlDirective, FormGroupDirective, FormGroupsDirective} from './form-control.directive';
import {FormResetDirective} from './form-reset.directive';
import {FormValidateDirective} from './form-validate.directive';
import {HiddenDirective} from './hidden.directive';
import {InputFileDirective} from './input-file.directive';
import {InputValidDirective} from './input-valid.directive';
import {InvalidComponent} from './invalid.component';
import {InvalidPipe} from './invalid.pipe';
import {JoinPipe} from './join.pipe';
import {NumericPipe} from './numeric.pipe';
import {PluckPipe} from './pluck.pipe';
import {PostalPipe} from './postal.pipe';
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
        BytesPipe,
        DatericPipe,
        DialogDirective,
        FileComponent,
        FileIconPipe,
        FilterPipe,
        FormControlDirective,
        FormGroupDirective,
        FormGroupsDirective,
        FormResetDirective,
        FormValidateDirective,
        HiddenDirective,
        InputFileDirective,
        InputValidDirective,
        InvalidComponent,
        InvalidPipe,
        JoinPipe,
        NumericPipe,
        PluckPipe,
        PostalPipe,
        ProvideControlDirective,
        RouterLinkActiveDirective,
        SafeUrlPipe,
        StringifyPipe,
        TimestampPipe,
        UnavailablePipe
    ],
    exports: [
        BoolericPipe,
        BytesPipe,
        DatericPipe,
        DialogDirective,
        FileComponent,
        FileIconPipe,
        FilterPipe,
        FormControlDirective,
        FormGroupDirective,
        FormGroupsDirective,
        FormResetDirective,
        FormValidateDirective,
        HiddenDirective,
        InputFileDirective,
        InputValidDirective,
        InvalidComponent,
        InvalidPipe,
        JoinPipe,
        NgCommonModule,
        NgFormsModule,
        NgRouterModule,
        NumericPipe,
        PluckPipe,
        PostalPipe,
        ProvideControlDirective,
        RouterLinkActiveDirective,
        SafeUrlPipe,
        StringifyPipe,
        TimestampPipe,
        UnavailablePipe
    ]
})
export class CommonModule {
}
