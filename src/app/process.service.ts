/**
 * Provides application process properties and management.
 *
 * document:keydown.Escape
 * Keyboard event handler is defined in the main application component.
 */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';

import {Model} from './model';

/**
 * General process model.
 */
export class ProcessModel extends Model<ProcessModel> {
    subject: any;
    cancelable: boolean;
    cancels$ = new Subject<Event>();
}

/**
 * Task process model.
 */
export class TaskModel extends ProcessModel {
    subject: Function;
    handler?: Function;
    force?: boolean;
    result?: any;
}

@Injectable()
export class ProcessService {
    /**
     * Ref. to the top process.
     */
    get top(): ProcessModel {
        return this.processes[0];
    }

    /**
     * List of task processes (stream).
     */
    private tasks$ = new Subject<TaskModel>();

    /**
     * List of active processes (last in, first out).
     */
    private processes: ProcessModel[] = [];

    constructor() {
        this.tasks$.subscribe((process: TaskModel) => {
            this.handle(process);
        });
    }

    /**
     * Calls for the top process cancelation.
     */
    cancel(event: Event) {
        const process = this.processes[0];

        if (process && process.cancelable) {
            process.cancels$.next(event);
        }
    }

    /**
     *  Prepares a task process.
     */
    task(process: any): TaskModel {
        if (!(process instanceof TaskModel)) {
            process = new TaskModel(process);
        }

        this.tasks$.next(process);

        return process;
    }

    /**
     * Initializes a process.
     */
    init(process: any): ProcessModel {
        if (!(process instanceof ProcessModel)) {
            process = new ProcessModel(process);
        }

        this.processes.unshift(process);

        return process;
    }

    /**
     * Finishes a process.
     */
    finish(process: ProcessModel) {
        const index = this.processes.indexOf(process);

        this.processes.splice(index, 1);
    }

    /**
     * Handles a task process.
     */
    private handle(process: TaskModel) {
        this.init(process);

        process.result = process.subject();

        this.finish(process);

        if (process.force || process.result != null) {
            if (process.handler) {
                process.handler(process.result);
            }
        }
    }
}
