/**
 * Navigation history state model.
 */
import {Model} from './model';

export class HistoryStateModel extends Model<HistoryStateModel> {
    /**
     * Application identification.
     */
    applicationId: string;

    /**
     * Route/navigation identification (starts with 1).
     */
    navigationId: number;

    /**
     * Route/navigation timestamp.
     */
    navigated: Date;

    /**
     * History popped timestamp, or undefined.
     */
    popped?: Date;
}
