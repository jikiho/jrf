/**
 * Directive to enhance a form, form group and form control.
 */
import {Directive, OnInit, OnDestroy, ElementRef, HostListener} from '@angular/core';
import {ControlContainer, NgControl, NgForm, NgModelGroup, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Rx';

/**
 * Updates form group errors.
 */
function updateGroupErrors(group: FormGroup) {
    const errors = {};

    if (!group.valid) {
        const controls = group.controls;

        for (let name in controls) {
            const control = controls[name];

            if (!control.valid) {
                errors[name] = control.errors;
            }
        }
    }

    group.setErrors(group.valid ? null : errors, {
        emitEvent: false
    });
}

/**
 * Provides a form element (native element).
 * Propagates children control errors.
 */
@Directive({
    selector: 'form'
})
export class FormGroupDirective implements OnInit, OnDestroy {
    private changes: Subscription[] = [];

    constructor(private form: NgForm, private el: ElementRef) {
    }

    ngOnInit() {
        this.form['el'] = this.el;
        //this.el['form'] = this.form;

        setTimeout(() => {
            this.changes.push(this.form.control.statusChanges.subscribe((status) =>
                    updateGroupErrors(this.form.control)));
        });
    }

    ngOnDestroy() {
        while (this.changes.length) {
            this.changes.shift().unsubscribe();
        }
    }
}

/**
 * Propagates children control errors.
 */
@Directive({
    selector: '[ngModelGroup]' //[ngModelGroup], [formGroup], [formGroupName]
})
export class FormGroupsDirective implements OnInit, OnDestroy {
    private changes: Subscription[] = [];

    constructor(private model: NgModelGroup) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.changes.push(this.model.control.statusChanges.subscribe((status) =>
                    updateGroupErrors(this.model.control)));
        });
    }

    ngOnDestroy() {
        while (this.changes.length) {
            this.changes.shift().unsubscribe();
        }
    }
}

/**
 * Provides a control form, control element (native element),
 * and control activity (focus) status.
 */
@Directive({
    selector: '[ngModel]' //[ngModel], [formControl], [formControlName]
})
export class FormControlDirective implements OnInit {
    get form(): NgForm {
        return this.container.formDirective ? (this.container.formDirective as NgForm) : null;
    }

    constructor(private container: ControlContainer,
            private model: NgControl, private el: ElementRef) {
    }

    ngOnInit() {
        const control = this.model.control;

        control['form'] = this.form;

        control['el'] = this.el;
        //this.el['control'] = control;
    }

    @HostListener('focusin')
    private onFocus() {
        this.model.control['active'] = true;
    }

    @HostListener('focusout')
    private onBlur() {
        this.model.control['active'] = false;
    }
}
